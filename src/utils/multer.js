const multer = require("multer");
const fs = require("fs");

exports.multerStorage = (destination, maxSize) => {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destination);
    },

    filename: function (req, file, cb) {
      const imageFile = file.originalname.split(".");
      const extName = imageFile.pop();
      const fileName = imageFile.join(".");

      cb(null, `${fileName}-${Date.now()}.${extName}`);
    },
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: maxSize * 1024 * 1024 }, // dynamically set max size to MB
  });

  return upload;
};
