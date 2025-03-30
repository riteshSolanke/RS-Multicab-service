const express = require("express");
const multer = require("multer");
const router = express.Router({ mergeParams: true });

const {
  uploadProfilePic,
  uploadSliderImages,
  uploadHomePopDestinationData,
  uploadCarBookingData,
  uploadDestinationData,
} = require("../../controllers/custmor/custmorUploadController");



const {upload} = require("../../config/custmor/multerUploadConfig");

router.post("/uploadProfilePic", upload.single("website-logo"), uploadProfilePic);

router.post(
  "/uploadSliderImgs",
  upload.fields([
    { name: "slidebar-image1", maxCount: 1 },
    { name: "slidebar-image2", maxCount: 1 },
    { name: "slidebar-image3", maxCount: 1 },
    { name: "slidebar-image4", maxCount: 1 },
    { name: "slidebar-image5", maxCount: 1 },
    { name: "slidebar-image6", maxCount: 1 },
  ]),
  uploadSliderImages
);

router.post(
  "/uploadHomePopDestinationData",
  upload.fields([
    { name: "popular-destination-img1", maxCount: 1 },
    { name: "popular-destination-img2", maxCount: 1 },
    { name: "popular-destination-img3", maxCount: 1 },
    { name: "popular-destination-img4", maxCount: 1 },
  ]),
  uploadHomePopDestinationData
);

router.post("/uploadCarBookingData", upload.single("carImg"), uploadCarBookingData);
router.post("/uploadDestinationData", upload.single("destinationImg"), uploadDestinationData);

module.exports = router;