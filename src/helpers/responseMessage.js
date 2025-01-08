const successResponse = async (res, statusCode = 200, message, data) => {
  return res.status(statusCode).json({ success: true, message, data });
};

const errorResponse = async (res, statusCode = 400, message, data) => {
  return res.status(statusCode).json({ success: false, error: message, data });
};

module.exports = { successResponse, errorResponse };
