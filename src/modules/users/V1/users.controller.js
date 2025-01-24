const { isValidObjectId } = require("mongoose");
const userModel = require("../../../../models/users");
const sellerModel = require("../../../../models/seller");

const {
  errorResponse,
  successResponse,
} = require("../../../helpers/responseMessage");

const provinces = require("../../../../Cities/provinces.json");
const cities = require("../../../../Cities/cities.json");
const { createPagination } = require("../../../helpers/pagination");

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

    await sellerModel.findOneAndUpdate(
      { userID: mainUser._id },
      {
        isActive: false,
      }
    );

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

exports.addAddress = async (req, res, next) => {
  try {
    const {
      addressName,
      postalCode,
      location,
      provincesID,
      cityID,
      physicalAddress,
    } = req.body;

    const userProvince = provinces.find(
      (provinces) => +provinces.id === +provincesID
    );

    const userCity = cities.find((city) => +city.id === +cityID);

    if (!userProvince || !userCity) {
      return errorResponse(res, 404, "Province Or City Not Found !!");
    }

    if (
      userProvince.id !== userCity.province_id ||
      userCity.province_id !== userProvince.id
    ) {
      return errorResponse(
        res,
        409,
        "The selected city and province do not belong to each other."
      );
    }
    const existingAddress = await userModel.findOne({
      _id: req.user.id,
      "addresses.cityID": cityID,
      "addresses.provincesID": provincesID,
    });

    if (existingAddress) {
      return res.status(400).json({
        success: false,
        message: "You already have an address with the same city and province.",
      });
    }

    const newAddress = {
      addressName,
      postalCode,
      location,
      provincesID,
      cityID,
      physicalAddress,
    };

    await userModel
      .findByIdAndUpdate(
        req.user.id,
        {
          $push: {
            addresses: newAddress,
          },
        },
        { new: true }
      )
      .select("-password");

    return successResponse(res, 201, "New Address Added Successfully.");
  } catch (error) {
    next(error);
  }
};

exports.removeAddress = async (req, res, next) => {
  try {
    const { addressID } = req.params;
    const user = req.user._id;

    if (!isValidObjectId(addressID)) {
      return errorResponse(res, 409, "Address ID Not Valid !!");
    }

    const mainUser = await userModel.findById(user);

    const isAddressExist = mainUser.addresses.id(addressID);

    if (!isAddressExist) {
      return errorResponse(res, 404, "Address Not Found !!");
    }

    mainUser.addresses.pull(addressID);
    await mainUser.save();

    return successResponse(res, 200, "Your Address Removed Successfully.");
  } catch (error) {
    next(error);
  }
};

exports.getAllAddresses = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id).lean();

    const addresses = user.addresses;

    if (!addresses || addresses.length === 0) {
      return errorResponse(
        res,
        404,
        "You have not registered any address yet!!!!"
      );
    }

    const result = addresses.map((address) => {
      const province = provinces.find((p) => p.id === address.provincesID);

      const city = cities.find((c) => c.id === address.cityID);

      return {
        ...address,
        provincesName: province.name,
        cityName: city.name,
      };
    });

    return successResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
};

exports.removeAllAddresses = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);

    const addresses = user.addresses;

    if (!addresses || addresses.length === 0) {
      return errorResponse(
        res,
        404,
        "You have not registered any address yet!!!!"
      );
    }

    user.addresses = [];
    await user.save();

    return successResponse(
      res,
      200,
      "All your addresses have been successfully deleted."
    );
  } catch (error) {
    next(error);
  }
};

exports.getAddresses = async (req, res, next) => {
  try {
    const { addressID } = req.params;

    if (!isValidObjectId(addressID)) {
      return errorResponse(res, 409, "Address ID Not Valid !!");
    }

    const user = await userModel.findById(req.user._id);

    const address = user.addresses.id(addressID);

    if (!address) {
      return errorResponse(res, 404, "Address Not Found !!");
    }

    return successResponse(res, 200, address);
  } catch (error) {
    next(error);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const {
      addressName,
      postalCode,
      location,
      provincesID,
      cityID,
      physicalAddress,
    } = req.body;

    const { addressID } = req.params;

    const user = await userModel.findById(req.user._id);

    const userAddress = user.addresses.id(addressID);

    if (!userAddress) {
      return errorResponse(res, 404, "Address Not Found !!");
    }

    userAddress.addressName = addressName || userAddress.addressName;
    userAddress.postalCode = postalCode || userAddress.postalCode;
    userAddress.location = location || userAddress.location;
    userAddress.physicalAddress =
      physicalAddress || userAddress.physicalAddress;

    //* Check only if provincesID and cityID values ​​are submitted

    if (provincesID || cityID) {
      const userProvince = provinces.find(
        (province) => +province.id === +provincesID
      );
      const userCity = cities.find((city) => +city.id === +cityID);

      if (!userProvince || !userCity) {
        return errorResponse(res, 404, "Province Or City Not Found !!");
      }

      if (userProvince.id !== userCity.province_id) {
        return errorResponse(
          res,
          409,
          "The selected city and province do not belong to each other."
        );
      }

      userAddress.provincesID = provincesID || userAddress.provincesID;
      userAddress.cityID = cityID || userAddress.cityID;
    }

    await user.save();

    return successResponse(res, 200, "Your Address Updated Successfully.");
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const userRole = req.user.roles;

    if (!userRole.includes("OWNER") && !userRole.includes("ADMIN")) {
      return errorResponse(res, 403, "You don't have access to this route !!");
    }

    const users = await userModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-password")
      .lean();

    const totalUsers = await userModel.countDocuments();

    const pagination = createPagination(page, limit, totalUsers, "Users");

    return successResponse(res, 200, { users, pagination });
  } catch (error) {
    next(error);
  }
};

exports.changeRoles = async (req, res, next) => {
  try {
    const { userID } = req.params;
    const { role } = req.body;

    if (!isValidObjectId(userID)) {
      return errorResponse(res, 409, "User ID Not Valid !!");
    }

    const isUserExist = await userModel.findById(userID).select("-password");

    if (!isUserExist) {
      return errorResponse(res, 404, "User Not Found !! ");
    }

    if (isUserExist.isRestrict) {
      return errorResponse(
        res,
        409,
        "This user is ban and can't be change role !! ",
        isUserExist
      );
    }

    if (isUserExist.roles.includes(role)) {
      return errorResponse(res, 409, `This user role already is a ${role} !!`);
    }

    if (role === "OWNER") {
      isUserExist.roles = ["OWNER"];
    } else if (role === "ADMIN") {
      isUserExist.roles = ["ADMIN"];
    } else if (role === "AUTHOR") {
      isUserExist.roles = ["AUTHOR"];
    } else if (role === "SELLER") {
      isUserExist.roles = ["USER", "SELLER"];
    } else {
      return errorResponse(
        res,
        409,
        `${role} Not Valid !! Only the roles (OWNER - ADMIN - AUTHOR And SELLER) are allowed.`
      );
    }
    await isUserExist.save();

    return successResponse(
      res,
      200,
      `User role changed to ${role} successfully.`
    );
  } catch (error) {
    next(error);
  }
};
