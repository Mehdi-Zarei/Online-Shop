module.exports = {
  server: {
    port: process.env.SERVER_PORT,
  },

  DB: {
    uri: process.env.MONGO_URI,
  },

  redis: {
    uri: process.env.REDIS_URI,

    refreshTokenExpireTimeInRedis:
      process.env.REFRESH_TOKEN_EXPIRE_TIME_IN_REDIS,
  },

  auth: {
    jwtSecretAccessToken: process.env.JWT_SECRET_ACCESS_TOKEN,

    jwtSecretRefreshToken: process.env.JWT_SECRET_REFRESH_TOKEN,

    accessTokenExpireInMinutes: process.env.ACCESS_TOKEN_EXPIRES_IN_MINUTES,

    refreshTokenExpireInDays: process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS,
  },

  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,

    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },

  otp: {
    pattern: process.env.OTP_PATTERN,
    user: process.env.OTP_USER,
    pass: process.env.OTP_PASS,
  },

  nodemailer: {
    user: process.env.nodemailerEmailAccount,
    pass: process.env.nodemailerPasswordAccount,
  },

  zarinpal: {
    merchantID: process.env.ZARINPAL_MERCHANT_ID,
    apiBaseUrl: process.env.ZARINPAL_API_BASE_URL,
    paymentBaseUrl: process.env.ZARINPAL_PAYMENT_BASE_URL,
    paymentCallbackUrl: process.env.ZARINPAL_PAYMENT_CALLBACK_URL,
  },

  domain: process.env.DOMAIN,

  isProduction: process.env.NODE_ENV,
};
