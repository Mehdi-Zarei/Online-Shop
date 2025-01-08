const request = require("request");
const configs = require("../../configs");

const sentOtp = async (userPhone, otpCode) => {
  return new Promise((resolve) => {
    request.post(
      {
        url: "http://ippanel.com/api/select",
        body: {
          op: "pattern",
          user: configs.otp.user,
          pass: configs.otp.pass,
          fromNum: "3000505",
          toNum: userPhone,
          patternCode: configs.otp.pattern,
          inputData: [{ "verification-code": otpCode }],
        },
        json: true,
      },
      function (error, response, body) {
        if (Array.isArray(body) || body.length > 1) {
          console.log("OTP Error Body -->", body);
          resolve({ success: false });
          return;
        }

        resolve({ success: true });
      }
    );
  });
};

module.exports = sentOtp;
