const errorHandler = (err, req, res, next) => {
  console.log(err);
  return res.json({
    statusCode: err.status || 500,
    msg: err.message || "Server Error !!",
  });
};

module.exports = { errorHandler };
