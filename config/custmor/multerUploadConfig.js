// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");

// // Ensure directory exists
// function ensureDirectoryExists(dir) {
//   if (!fs.existsSync(dir)) {
//     console.log("Creating Directory:", dir);
//     fs.mkdirSync(dir, { recursive: true });
//   } else {
//     console.log("Directory Already Exists:", dir);
//   }
// }

// // Multer Storage Configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     try {
//       const custmorId = req.session.custmor?._id.toString();

//       const folderType = req.params.folderType;

//       if (!custmorId || !folderType) {
//         console.error("Missing Parameters: custmorId or folderType");
//         return cb(new Error("custmorId and folderType are required!"), null);
//       }

//       const uploadPath = path.join(
//         __dirname,
//         "../../localDB",
//         custmorId,
//         folderType
//       );
//       ensureDirectoryExists(uploadPath);
//       req.uploadPath = uploadPath;

//       cb(null, uploadPath);
//     } catch (error) {
//       console.error("Error in destination:", error);
//       cb(error, null);
//     }
//   },
//   filename: function (req, file, cb) {
//     try {
//       const ext = path.extname(file.originalname); // Extract file extension
//       const baseName = file.fieldname; // Base filename
//       let newFileName;

//       if (!req.uploadPath) {
//         console.error("uploadPath is undefined!");
//         return cb(new Error("Upload path is not defined!"), null);
//       }

//       if (file.fieldname === "carImg" || file.fieldname === "destinationImg") {
//         newFileName = `${Date.now()}_${baseName}${ext}`;
//       } else {
//         try {
//           // Ensure directory exists before reading files
//           ensureDirectoryExists(req.uploadPath);

//           const existingFiles = fs
//             .readdirSync(req.uploadPath)
//             .filter((f) => path.parse(f).name === baseName);

//           existingFiles.forEach((existingFile) => {
//             fs.unlinkSync(path.join(req.uploadPath, existingFile));
//           });
//         } catch (err) {
//           console.error("Error while deleting old files:", err);
//         }

//         newFileName = `${baseName}${ext}`;
//       }

//       cb(null, newFileName);
//     } catch (error) {
//       console.error("Error in filename:", error);
//       cb(error, null);
//     }
//   },
// });

// // File filter to allow only images
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|gif/;
//   const isValidExt = allowedTypes.test(
//     path.extname(file.originalname).toLowerCase()
//   );
//   const isValidMime = allowedTypes.test(file.mimetype);

//   if (isValidExt && isValidMime) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images (JPEG, JPG, PNG, GIF) are allowed!"), false);
//   }
// };

// // Multer Upload Middleware
// const upload = multer({
//   storage: storage,
//   // limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: fileFilter,
// });

// module.exports = upload;
require("dotenv").config();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "RS-CabService",
    format: async (req, file) => {
      const allowedFormats = ["jpg", "jpeg", "png"];
      const fileFormat = file.mimetype.split("/")[1];
      return allowedFormats.includes(fileFormat) ? fileFormat : "jpg"; // Default to jpg
    },
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0].replace(/\s+/g, "_")}`,
  },
});

// Configure Multer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
});

module.exports = { upload, cloudinary };



