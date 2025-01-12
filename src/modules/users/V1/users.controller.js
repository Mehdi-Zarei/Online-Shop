const { isValidObjectId } = require("mongoose");
const userModel = require("../../../../models/users");
const {
  errorResponse,
  successResponse,
} = require("../../../helpers/responseMessage");

const provinces = require("../../../../Cities/provinces.json");
const cities = require("../../../../Cities/cities.json");

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

    const updatedUserAddress = await userModel
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

    return successResponse(
      res,
      201,
      "New Address Added Successfully.",
      updatedUserAddress
    );
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
    const userAddress = await userModel
      .findById(req.user._id)
      .select("addresses")
      .lean();

    if (!userAddress) {
      return errorResponse(
        res,
        404,
        "You have not registered any address yet!!!!"
      );
    }
    const addresses = userAddress.addresses;

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
  } catch (error) {
    next(error);
  }
};
