const bodyValidator = (validator) => {
  return async (req, res, next) => {
    try {
      await validator.validate(req.body, { abortEarly: false });
      next();
    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }
  };
};

module.exports = { bodyValidator };
