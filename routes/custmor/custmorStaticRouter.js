const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  renderCustmorHomePage,
  renderManageWebsitePage,
  renderManageCarPage,
  renderAddCustmorCarPage,
  renderDeleteCarPage,
  renderManageDestinationPage,
  renderAddDestinationPage,
  renderDeleteDestinationPage,
  renderDestinationControlPage,
  renderCustmorBookingPage,
  renderCheckEnquiryPage,
  renderManagePackagePage

} = require("../../controllers/custmor/custmorStaticController");
const {getCarsData, getTargetedCarData }= require("../../middelwares/custmor/getCarData");
const{getBookingData} = require("../../middelwares/custmor/getBookingData");
const{getEnquiryData} = require("../../middelwares/custmor/getEnquiryData");

router.get("/", renderCustmorHomePage);
router.get("/manageWebsite", renderManageWebsitePage);
router.get("/manageCar",getCarsData, renderManageCarPage);
router.get("/addCar", renderAddCustmorCarPage);
router.get("/deleteCar",getCarsData, renderDeleteCarPage);
router.get("/manageDestination", renderManageDestinationPage);
router.get("/addDestination", renderAddDestinationPage);
router.get("/deleteDestination", renderDeleteDestinationPage);
router.get("/destinationControl", renderDestinationControlPage);
router.get("/checkBooking",getBookingData, renderCustmorBookingPage)
router.get("/checkEnquiry",getEnquiryData, renderCheckEnquiryPage);
router.get("/managePackage", getCarsData, renderManagePackagePage)

module.exports = router;
