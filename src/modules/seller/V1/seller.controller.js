const sellerModel = require("../../../../models/seller");

const provinces = require("../../../../Cities/provinces.json");
const cities = require("../../../../Cities/cities.json");

//* Helper Functions
const {
  errorResponse,
  successResponse,
} = require("../../../helpers/responseMessage");

exports.register = async (req, res, next) => {
  try {
    const {
      storeName,
      contactDetails,
      location,
      provincesID,
      cityID,
      physicalAddress,
    } = req.body;

    const isSellerExist = await sellerModel
      .findOne({ userID: req.user.id })
      .select("-password");

    if (isSellerExist) {
      if (!isSellerExist.isActive) {
        return errorResponse(
          res,
          409,
          "Your information for store registration is being reviewed. !!"
        );
      }
      return errorResponse(
        res,
        409,
        "You have one registered store and are not allowed to add another store !!"
      );
    }

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

    const newSeller = await sellerModel.create({
      storeName,
      contactDetails,
      provincesID,
      cityID,
      location,
      physicalAddress,
      isActive: false,
      userID: req.user.id,
    });

    return successResponse(
      res,
      201,
      "Your store information has been successfully submitted and you will be notified of its approval or rejection after review.",
      newSeller
    );
  } catch (error) {
    next(error);
  }
};
