const userModel = require("../../../../models/users");

const bcrypt = require("bcryptjs");

//* Redis Helper
const {
  gettingOtpInfoFromRedis,
  saveOtpInRedis,
  saveRefreshTokenInRedis,
  gettingOtpFromRedis,
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

exports.sent = async (req, res, next) => {
  try {
    const { phone } = req.body;

    const isUserExist = await userModel.findOne({ phone }).lean();

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
