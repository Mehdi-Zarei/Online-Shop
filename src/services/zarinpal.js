const { default: axios } = require("axios");

const configs = require("../../configs");

const zarinpal = axios.create({
  baseURL: configs.zarinpal.apiBaseUrl,
});

exports.createPayment = async function ({ amountInRial, description, mobile }) {
  try {
    const response = await zarinpal.post("/request.json", {
      merchant_id: configs.zarinpal.merchantID,
      callback_url: configs.zarinpal.paymentCallbackUrl,
      amount: amountInRial,
      description,
      metadata: {
        mobile,
      },
    });

    const data = response.data.data;

    return {
      authority: data.authority,
      paymentUrl: configs.zarinpal.paymentBaseUrl + data.authority,
    };
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

exports.verifyPayment = async function ({ amountInRial, authority }) {
  try {
    const response = await zarinpal.post(
      "/verify.json",
      {
        merchant_id: configs.zarinpal.merchantID,
        amount: amountInRial,
        authority,
      },
      {
        validateStatus: function (status) {
          return status <= 500;
        },
      }
    );

    const data = response.data.data;

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
