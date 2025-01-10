const configs = require("../../configs");
const redis = require("../redis");

const saveOtpInRedis = async (key, otpCode) => {
  try {
    const result = await redis.set(`otp:${key}`, otpCode, "EX", 60);
    return result;
  } catch (error) {
    throw error;
  }
};

const gettingOtpFromRedis = async (phone) => {
  try {
    const getOTP = await redis.get(`otp:${phone}`);

    if (!getOTP) {
      return {
        remainingTime: 0,
        expired: true,
      };
    }
    return getOTP;
  } catch (error) {
    throw error;
  }
};

const gettingOtpInfoFromRedis = async (phone) => {
  try {
    const remainingTime = await redis.ttl(`otp:${phone}`); // Time in seconds

    if (remainingTime <= 0) {
      return {
        expired: true,
        remainingTime: 0,
      };
    }

    const minutes = Math.floor(remainingTime / 60);

    const seconds = remainingTime % 60;

    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    return {
      expired: false,
      remainingTime: formattedTime,
    };
  } catch (error) {
    throw error;
  }
};

const saveRefreshTokenInRedis = async (key, value) => {
  try {
    const refreshToken = await redis.set(
      `refreshToken:${key}`,
      value,
      "EX",
      configs.redis.refreshTokenExpireTimeInRedis
    );

    return refreshToken;
  } catch (error) {
    throw error;
  }
};

const getRefreshTokenFromRedis = async (key) => {
  const refreshToken = await redis.get(`refreshToken:${key}`);
  return refreshToken;
};

const saveResetPasswordTokenInRedis = async (key, email) => {
  try {
    const token = await redis.hset(`resetPassword:${key}`, {
      token: key,
      email,
    });
    await redis.expire(`resetPassword:${key}`, 3600); //* 1 Hour
    return token;
  } catch (error) {
    throw error;
  }
};

const gettingResetPasswordTokenFromRedis = async (key) => {
  try {
    const token = await redis.hgetall(`resetPassword:${key}`);
    return token;
  } catch (error) {
    throw error;
  }
};

const removeResetPasswordTokenFromRedis = async (key) => {
  try {
    const token = await redis.del(`resetPassword:${key}`);

    return token;
  } catch (error) {
    throw error;
  }
};

const removeRefreshTokenFromRedis = async (key) => {
  try {
    const remove = await redis.del(`refreshToken:${key}`);

    return remove;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  saveOtpInRedis,
  gettingOtpInfoFromRedis,
  saveRefreshTokenInRedis,
  gettingOtpFromRedis,
  getRefreshTokenFromRedis,
  saveResetPasswordTokenInRedis,
  gettingResetPasswordTokenFromRedis,
  removeResetPasswordTokenFromRedis,
  removeRefreshTokenFromRedis,
};
