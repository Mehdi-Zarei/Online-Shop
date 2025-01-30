const axios = require("axios");
const configs = require("../../configs");

const sentOtp = async (userPhone, otpCode) => {
  try {
    const response = await axios.post("http://ippanel.com/api/select", {
      op: "pattern",
      user: configs.otp.user,
      pass: configs.otp.pass,
      fromNum: "3000505",
      toNum: userPhone,
      patternCode: configs.otp.pattern,
      inputData: [{ "verification-code": otpCode }],
    });

    if (Array.isArray(response.data) || response.data.length > 1) {
      console.log("OTP Error Body -->", response.data);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("OTP Error -->", error);
    return { success: false };
  }
};

module.exports = sentOtp;
