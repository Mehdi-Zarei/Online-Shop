const jwt = require("jsonwebtoken");
const configs = require("../../configs");
const userModel = require("../../models/users");

const rolesGuard = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res
          .status(401)
          .json({
            message: "No token provided!You don't have access to this routes",
          });
      }

      const decoded = jwt.verify(token, configs.auth.jwtSecretAccessToken);

      const user = await userModel.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      const hasRequiredRole = user.roles.some((role) =>
        requiredRoles.includes(role)
      );

      if (!hasRequiredRole) {
        return res
          .status(403)
          .json({ message: "You don't have access to this route!" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  };
};

module.exports = rolesGuard;
