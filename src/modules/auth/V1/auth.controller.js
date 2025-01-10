const userModel = require("../../../../models/users");
const configs = require("../../../../configs");

const bcrypt = require("bcryptjs");
const uuid = require("uuid").v4;

//* Redis Helper
const {
  gettingOtpInfoFromRedis,
  saveOtpInRedis,
  saveRefreshTokenInRedis,
  gettingOtpFromRedis,
  saveResetPasswordTokenInRedis,
  gettingResetPasswordTokenFromRedis,
  removeResetPasswordTokenFromRedis,
  removeRefreshTokenFromRedis,
} = require("../../../helpers/redis");

//* Response Helper
const {
  errorResponse,
  successResponse,
} = require("../../../helpers/responseMessage");

//* OTP Service
const sentOtp = require("../../../services/sentOtp");

//* JWT Helper
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../../helpers/accessAndRefreshToken");

//* Email Service
const { sendVerificationEmail } = require("../../../utils/nodemailer");

exports.sent = async (req, res, next) => {
  try {
    const { phone, type } = req.body;

    const isUserExist = await userModel.findOne({ phone }).lean();

    if (type === "register") {
      if (isUserExist) {
        if (isUserExist.isRestrict) {
          return errorResponse(res, 409, "User Already Is Banned !!");
        } else {
          return errorResponse(
            res,
            409,
            "User Already Exist With This Phone Number !!"
          );
        }
      }
    } else if (type === "login") {
      if (!isUserExist) {
        return errorResponse(res, 404, "User not found!");
      }

      if (isUserExist.isRestrict) {
        return errorResponse(res, 409, "This User is banned!");
      }
    } else {
      return errorResponse(
        res,
        400,
        "Invalid request type. Use 'login' or 'register'."
      );
    }

    const { expired, remainingTime } = await gettingOtpInfoFromRedis(phone);

    if (!expired) {
      return errorResponse(res, 400, {
        message: `OTP already sent, Please try again after ${remainingTime}`,
      });
    }

    const generateOtpCode =
      Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

    console.log(generateOtpCode); //TODO: Remove log

    await saveOtpInRedis(phone, generateOtpCode);

    await sentOtp(phone, generateOtpCode);

    return successResponse(
      res,
      200,
      {
        message: "Otp Code Sent Successfully To Your Phone Number.",
      },
      phone
    );
  } catch (error) {
    next(error);
  }
};

exports.verify = async (req, res, next) => {
  try {
    const { phone, otp, name, email, password, isSeller } = req.body;

    const isUserExist = await userModel.findOne({ email }).lean();

    if (isUserExist) {
      return errorResponse(res, 409, "This Email Address Already Exist  !!");
    }

    const savedOtpFromRedis = await gettingOtpFromRedis(phone);

    if (!savedOtpFromRedis) {
      return errorResponse(res, 404, {
        message: "OTP Code Has Expired !!Please reapply. ",
      });
    }

    if (savedOtpFromRedis !== otp) {
      return errorResponse(res, 404, {
        message: "OTP Code Has Expired Or Incorrect.",
      });
    }

    const isFirstUser = (await userModel.countDocuments()) === 0;

    const hashedPassword = bcrypt.hashSync(password, 12);

    const newUser = await userModel.create({
      phone,
      name,
      email,
      roles: isFirstUser ? ["OWNER"] : isSeller ? ["SELLER", "USER"] : ["USER"],
      password: hashedPassword,
      avatar: "null",
      isRestrict: false,
      provider: "local",
    });

    const accessToken = generateAccessToken(newUser._id, newUser.roles);

    const refreshToken = generateRefreshToken(newUser._id);

    const hashedRefreshToken = bcrypt.hashSync(refreshToken, 12);

    await saveRefreshTokenInRedis(newUser._id, hashedRefreshToken);

    return successResponse(
      res,
      201,
      { message: "New User Created Successfully." },
      { accessToken, refreshToken }
    );
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = req.user;

    const accessToken = generateAccessToken(user._id, user.roles);

    const refreshToken = generateRefreshToken(user._id);

    const hashedRefreshToken = bcrypt.hashSync(refreshToken, 12);

    await saveRefreshTokenInRedis(user._id, hashedRefreshToken);

    return successResponse(res, 200, "User Logged In Successfully.", {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.loginWithOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    const user = await userModel.findOne({ phone }).lean();

    if (user.isRestrict) {
      return errorResponse(res, 409, "This User is banned!");
    }

    const savedOtpFromRedis = await gettingOtpFromRedis(phone);

    if (!savedOtpFromRedis) {
      return errorResponse(res, 404, {
        message: "OTP Code Has Expired !!Please reapply. ",
      });
    }

    if (savedOtpFromRedis !== otp) {
      return errorResponse(res, 404, {
        message: "OTP Code Has Expired Or Incorrect.",
      });
    }

    const accessToken = generateAccessToken(user._id, user.roles);

    const refreshToken = generateRefreshToken(user._id);

    const hashedRefreshToken = bcrypt.hashSync(refreshToken, 12);

    await saveRefreshTokenInRedis(user._id, hashedRefreshToken);

    return successResponse(
      res,
      201,
      { message: "You Are Login Successfully." },
      { accessToken, refreshToken }
    );
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = req.user;

    return successResponse(res, 200, "OK", user);
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const user = req.user;

    const accessToken = generateAccessToken(user._id, user.roles);

    return successResponse(res, 200, "OK", { accessToken });
  } catch (error) {
    next(error);
  }
};

exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return errorResponse(res, 404, "User Not Found With This Email !!");
    }

    if (user.isRestrict) {
      return errorResponse(res, 403, "This User Already Is Banned !!");
    }

    const resetPasswordToken = uuid();

    const subject = "Reset Password Link";

    const text = `
    <p>سلام ${user.name} عزیز،</p>
    <p>درخواست تغییر رمز عبور برای حساب کاربری شما ثبت شده است. اگر این درخواست از سمت شما بوده است، لطفاً از طریق لینک زیر اقدام به تغییر رمز عبور خود کنید:</p>
    <a href="http://localhost:${configs.server.port}/api/v1/auth/reset-password/${resetPasswordToken}">تغییر رمز عبور</a>
    <p>این لینک تا <strong>۱ ساعت</strong> آینده معتبر است. اگر شما این درخواست را ارسال نکرده‌اید، لطفاً این ایمیل را نادیده بگیرید یا با پشتیبانی تماس بگیرید.</p>
    <p>با تشکر،</p>
    <p>تیم پشتیبانی</p>
`;

    const sentEmail = await sendVerificationEmail(user, subject, text);

    if (sentEmail) {
      await saveResetPasswordTokenInRedis(resetPasswordToken, email);
      return successResponse(res, 200, "Email has been sent successfully.");
    } else {
      return errorResponse(
        res,
        500,
        "Failed to send email. Please try again later."
      );
    }
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    const { token } = req.params;

    const savedToken = await gettingResetPasswordTokenFromRedis(token);

    if (!savedToken || savedToken.token !== token) {
      return errorResponse(res, 404, "Invalid or expired reset token.");
    }

    const hashedNewPassword = bcrypt.hashSync(password, 12);

    const updateUserPassword = await userModel.findOneAndUpdate(
      { email: savedToken.email },
      {
        password: hashedNewPassword,
      }
    );

    if (!updateUserPassword) {
      return errorResponse(res, 404, "User Not Found !!");
    }

    await removeResetPasswordTokenFromRedis(token);

    return successResponse(res, 200, "Your Password Updated Successfully.");
  } catch (error) {
    next(error);
  }
};

exports.logOut = async (req, res, next) => {
  try {
    const user = req.user;

    await removeRefreshTokenFromRedis(user._id);

    return successResponse(res, 200, "User logged out successfully.");
  } catch (error) {
    next(error);
  }
};
