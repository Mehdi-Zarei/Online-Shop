const { isValidObjectId } = require("mongoose");
const userModel = require("../../../models/users");
const {
  errorResponse,
  successResponse,
} = require("../../helpers/responseMessage");

exports.restrictUser = async (req, res, next) => {
  try {
    const { userID } = req.params;

    if (!isValidObjectId(userID)) {
      return errorResponse(res, 409, "User ID Not Valid !!");
    }

    const isOwnerOrAdmin = req.user.roles;

    if (
      !isOwnerOrAdmin.includes("OWNER") &&
      !isOwnerOrAdmin.includes("ADMIN")
    ) {
      return errorResponse(res, 403, "You don't have access to this route !!");
    }

    const mainUser = await userModel.findById(userID).select("-password");

    if (!mainUser) {
      return errorResponse(res, 404, "User Not Found !!");
    }

    if (mainUser.roles.includes("OWNER")) {
      return errorResponse(res, 403, "You cannot restrict the owner !!");
    }

    if (mainUser.isRestrict) {
      return errorResponse(res, 409, "User is already restricted !!");
    }

    await userModel
      .findByIdAndUpdate(userID, { isRestrict: true }, { new: true })
      .select("-password");

    return successResponse(res, 200, "User Restricted Successfully.", mainUser);
  } catch (error) {
    next(error);
  }
};

exports.unRestrictUser = async (req, res, next) => {
  try {
    const { userID } = req.params;

    if (!isValidObjectId(userID)) {
      return errorResponse(res, 409, "User ID Not Valid !!");
    }

    const isOwnerOrAdmin = req.user.roles;

    if (
      !isOwnerOrAdmin.includes("OWNER") &&
      !isOwnerOrAdmin.includes("ADMIN")
    ) {
      return errorResponse(res, 403, "You don't have access to this route !!");
    }
    const mainUser = await userModel.findById(userID).select("-password");

    if (!mainUser) {
      return errorResponse(res, 404, "User Not Found !!");
    }

    if (mainUser.roles.includes("OWNER")) {
      return errorResponse(
        res,
        403,
        "You cannot change the owner information!!"
      );
    }

    if (!mainUser.isRestrict) {
      return errorResponse(res, 409, "This user is not restricted !!");
    }

    await userModel
      .findByIdAndUpdate(userID, { isRestrict: false }, { new: true })
      .select("-password");

    return successResponse(
      res,
      200,
      "User Un Restricted Successfully.",
      mainUser
    );
  } catch (error) {
    next(error);
  }
};
