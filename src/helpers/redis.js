const configs = require("../../configs");
const redis = require("../redis");

const saveOtpInRedis = async (key, otpCode) => {
  try {
    const otp = await redis.set(`otp:${key}`, otpCode, "EX", 60);

    return otp;
  } catch (error) {
    next(error);
  }
};

const gettingOtpInfoFromRedis = async (key) => {
  const otp = await redis.get(`otp:${key}`);

  console.log("redis otp ->", otp);

  if (!otp) {
    return {
      expired: true,
      remainingTime: 0,
    };
  }
  const remainingTime = await redis.ttl(`otp:${key}`); // Time in seconds

  const minutes = Math.floor(remainingTime / 60);

  const seconds = remainingTime % 60;

  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return {
    otp,
    expired: false,
    remainingTime: formattedTime,
  };
};

const saveRefreshTokenInRedis = async (key, value) => {
  const refreshToken = await redis.set(
    `refreshToken:${key}`,
    value,
    "EX",
    configs.redis.refreshTokenExpireTimeInRedis
  );

  return refreshToken;
};

module.exports = {
  saveOtpInRedis,
  gettingOtpInfoFromRedis,
  saveRefreshTokenInRedis,
};
