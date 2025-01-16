const multer = require("multer");
const fs = require("fs");
const path = require("path");

exports.multerStorage = (destination, maxSize, allowedTypes = []) => {
  const fullPath = path.resolve(destination);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
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

  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.length > 0 && allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("File type is not allowed"), false);
    }
  };

  const upload = multer({
    storage: storage,
    limits: { fileSize: maxSize * 1024 * 1024 }, // dynamically set max size to MB
    fileFilter: fileFilter,
  });

  return upload;
};
