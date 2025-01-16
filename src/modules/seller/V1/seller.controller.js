const { isValidObjectId } = require("mongoose");

const sellerModel = require("../../../../models/seller");
const usersModel = require("../../../../models/users");

const provinces = require("../../../../Cities/provinces.json");
const cities = require("../../../../Cities/cities.json");

//* Helper Functions
const {
  errorResponse,
  successResponse,
} = require("../../../helpers/responseMessage");
const { sendVerificationEmail } = require("../../../utils/nodemailer");

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

exports.activateStore = async (req, res, next) => {
  try {
    const { storeID } = req.params;

    if (!isValidObjectId(storeID)) {
      return errorResponse(res, 409, "Store ID Not Valid !!");
    }

    const isStoreExisted = await sellerModel.findById(storeID);

    if (!isStoreExisted) {
      return errorResponse(res, 404, "Store Not Found !!");
    }

    if (isStoreExisted.isActive) {
      return errorResponse(res, 409, "This Store Already Is Actives !!");
    }

    const isTheSellerBanned = await usersModel.findById(isStoreExisted.userID);

    if (isTheSellerBanned.isRestrict) {
      return errorResponse(res, 404, "Seller Already Is Banned !!");
    }

    isStoreExisted.isActive = true;
    await isStoreExisted.save();

    isTheSellerBanned.roles = ["USER", "SELLER"];
    await isTheSellerBanned.save();

    const subject = "تبریک !!  فروشگاه شما فعال شد";

    const text = `
    <p>سلام ${isTheSellerBanned.name} عزیز،</p>
    <p>درخواست ایجاد فروشندگی شما با موفقیت مورد پذیرش واقع گردید،جهت دریافت اطلاعات بیشتر میتونی وارد پنل کاربری بشید </p>
    `;

    await sendVerificationEmail(isTheSellerBanned, subject, text);

    return successResponse(res, 200, "Store Active Successfully.");
  } catch (error) {
    next(error);
  }
};

exports.deactivateStore = async (req, res, next) => {
  try {
    const { storeID } = req.params;

    if (!isValidObjectId(storeID)) {
      return errorResponse(res, 409, "Store ID Not Valid !!");
    }

    const isStoreExisted = await sellerModel.findById(storeID);

    if (!isStoreExisted) {
      return errorResponse(res, 404, "Store Not Found !!");
    }

    if (!isStoreExisted.isActive) {
      return errorResponse(res, 409, "This Store Already Is Deactivate !!");
    }

    isStoreExisted.isActive = false;
    await isStoreExisted.save();

    const seller = await usersModel.findById(isStoreExisted.userID);

    const subject = "متاسفیم !!  فروشگاه شما غیر فعال شد";

    const text = `
    <p>سلام ${seller.name} عزیز،</p>
    <p>متاسفانه فروشگاه شما غیر فعال شده است.لطفا جهت دریافت اطلاعات بیشتر به پنل کاربری خودتون مراجعه کنید </p>
    `;

    await sendVerificationEmail(seller, subject, text);

    return successResponse(res, 200, "Store Deactivate Successfully.");
  } catch (error) {
    next(error);
  }
};

exports.updateSellerInfo = async (req, res, next) => {
  try {
    const { storeID } = req.params;

    if (!isValidObjectId(storeID)) {
      return errorResponse(res, 409, "Store ID Not Valid !!");
    }

    const {
      storeName,
      contactDetails,
      location,
      provincesID,
      cityID,
      physicalAddress,
    } = req.body;

    //TODO : Validation

    const isSellerExist = await sellerModel.findById(storeID);

    if (!isSellerExist) {
      return errorResponse(res, 404, "Store Not Found !!");
    }

    if (isSellerExist.userID.toString() !== req.user.id.toString()) {
      return errorResponse(res, 403, "You Don't Have Access To This Route !!");
    }

    const updateInfo = await sellerModel.findByIdAndUpdate(
      storeID,
      {
        storeName,
        contactDetails,
        location,
        provincesID,
        cityID,
        physicalAddress,
      },
      { new: true }
    );

    return successResponse(
      res,
      200,
      "Your Information Updated SuccessFully.",
      updateInfo
    );
  } catch (error) {
    next(error);
  }
};

exports.removeSellerStore = async (req, res, next) => {
  try {
    const { storeID } = req.params;

    if (!isValidObjectId(storeID)) {
      return errorResponse(res, 409, "Store ID Not Valid !!");
    }

    const isSellerExist = await sellerModel.findById(storeID);

    if (!isSellerExist) {
      return errorResponse(res, 404, "Store Not Found !!");
    }

    if (req.user.roles.some((role) => ["OWNER", "ADMIN"].includes(role))) {
      await sellerModel.findByIdAndDelete(isSellerExist._id);

      return successResponse(
        res,
        200,
        `Store Removed By ${req.user.roles.join(", ")} Successfully.`
      );
    }

    if (isSellerExist.userID.toString() !== req.user.id.toString()) {
      return errorResponse(res, 403, "You Don't Have Access To This Route !!");
    }

    await sellerModel.findByIdAndDelete(isSellerExist._id);

    return successResponse(res, 200, "Store Removed By Seller Successfully.");
  } catch (error) {
    next(error);
  }
};

exports.getInfo = async (req, res, next) => {
  try {
    const { storeID } = req.params;

    if (!isValidObjectId(storeID)) {
      return errorResponse(res, 409, "Store ID Not Valid !!");
    }

    const sellerStore = await sellerModel
      .findById(storeID)
      .populate("userID", "-password");

    if (!sellerStore) {
      return errorResponse(res, 404, "Store Not Found !!");
    }

    console.log("mainUser", req.user.roles);
    console.log("sellerStore", sellerStore.userID.toString());

    if (
      !req.user.roles.some((role) => ["OWNER", "ADMIN"].includes(role)) &&
      sellerStore.userID.toString() !== req.user.id.toString()
    ) {
      return errorResponse(res, 403, "You Don't Have Access To This Route !!");
    }

    return successResponse(res, 200, sellerStore);
  } catch (error) {
    next(error);
  }
};
