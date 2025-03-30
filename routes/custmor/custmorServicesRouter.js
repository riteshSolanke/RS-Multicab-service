const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  deleteExistingBookingCar,
  addNewPackage,
  addNewDriver,
  deleteTargetedDestinationData,
} = require("../../controllers/custmor/custmorServicesController");
const {getCarsData, getTargetedCarData }= require("../../middelwares/custmor/getCarData");

router.get("/deleteCar/:carId", deleteExistingBookingCar);
router.post("/addPackage", addNewPackage);
router.post("/addDriver",getCarsData, addNewDriver)
router.get("/deleteDestination/:destinationId", deleteTargetedDestinationData);


module.exports = router;
