const userModel = require("../../../../models/users");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  gettingOtpInfoFromRedis,
  saveOtpInRedis,
  saveRefreshTokenInRedis,
} = require("../../../helpers/redis");

const {
  errorResponse,
  successResponse,
} = require("../../../helpers/responseMessage");

const sentOtp = require("../../../services/sentOtp");
const configs = require("../../../../configs");

exports.sent = async (req, res, next) => {
  try {
    const { phone } = req.body;

    //TODO : Validator

    //TODO : If user exist you can redirect him to login

    const isUserExist = await userModel
      .findOne({ $or: [{ phone, isRestrict: true }] })
      .lean();

    if (isUserExist) {
      if (isUserExist.phone === phone) {
        return errorResponse(
          res,
          409,
          "User Already Exist With This Phone Number !!"
        );
      } else {
        return errorResponse(res, 409, "User Already Is Banned !!");
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

    console.log(generateOtpCode);

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

    //TODO Validator

    const isUserExist = await userModel.findOne({ email }).lean();

    if (isUserExist) {
      return errorResponse(res, 409, "This Email Address Already Exist  !!");
    }

    const savedOtp = await gettingOtpInfoFromRedis(phone);

    console.log("savedOtpCode ->", savedOtp);
    console.log("body otp ->", otp);

    if (!savedOtp) {
      return errorResponse(res, 404, {
        message: "OTP Code Has Expired !!Please reapply. ",
      });
    }

    if (savedOtp !== otp) {
      return errorResponse(res, 404, {
        message: "The otp code is incorrect.",
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
      avatar,
      isRestrict: false,
    });

    const accessToken = jwt.sign(
      { id: newUser._id, roles: newUser.roles },
      configs.auth.jwtSecretAccessToken,
      { expiresIn: configs.auth.accessTokenExpireInMinutes }
    );

    const refreshToken = jwt.sign(
      { id: newUser._id },
      configs.auth.jwtSecretRefreshToken,
      { expiresIn: configs.auth.refreshTokenExpireInDays }
    );

    const hashedRefreshToken = bcrypt.hashSync(refreshToken, 12);

    await saveRefreshTokenInRedis(newUser._id, hashedRefreshToken);

    return successResponse(
      res,
      201,
      { message: "New User Created Successfully." },
      { data: accessToken, refreshToken }
    );
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
