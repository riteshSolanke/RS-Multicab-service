const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  deleteExistingBookingCar,
  addNewPackage,
} = require("../../controllers/custmor/custmorServicesController");

router.get("/deleteCar/:carId", deleteExistingBookingCar);
router.post("/addPackage", addNewPackage);


module.exports = router;
