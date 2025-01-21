const multer = require("multer");
const fs = require("fs");
const path = require("path");

exports.multerStorage = (destination, maxSize, allowedTypes = []) => {
  try {
    const fullPath = path.resolve(destination);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, destination);
      },

      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${ext}`);
      },
    });

    const fileFilter = (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.length > 0 && allowedTypes.includes(ext)) {
        cb(null, true);
      } else {
        cb(
          new Error(
            "Invalid file type. Please upload files in the correct format." +
              "For images: Only .jpg, .jpeg, .png, and .svg formats are allowed." +
              "For videos: Only .mp4, .mov, and .avi formats are allowed." +
              "For documents: Only .pdf, .docx, and .txt formats are allowed."
          ),
          false
        );
      }
    };

    const upload = multer({
      storage: storage,
      limits: { fileSize: maxSize * 1024 * 1024 }, // dynamically set max size to MB
      fileFilter: fileFilter,
    });

    return upload;
  } catch (error) {
    throw error;
  }
};
