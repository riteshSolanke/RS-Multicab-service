const express = require("express");
const router = express.Router({ mergeParams: true });
const addCustmorStaticData = require("../../middelwares/custmor/addCustmorStaticData");
const addCustmorData = require("../../middelwares/custmor/addCustmorData");
const {
  renderUserHomePage,
  renderAboutUsPage,
  renderPakagesPage,
  renderBookAndPay,
  renderOnlineBooking,
  renderHolidayPage,
  renderEnquiryPage,
  renderContactUsPage,
  renderCorporateServicesPage,
  renderOurFleetPage,
  renderFAQPage,
  renderTestimonialsPage,
  renderCareerPage,
  renderCovidPage,
  renderPaymentSuccessPage,
  renderPaymentCancelPage,
  createCheckoutSessionAndBooking,
  saveEnquiryData,
  renderDynamicDestinationPage,
  
} = require("../../controllers/user/userStaticPageController");
const {getCarsData, getTargetedCarData }= require("../../middelwares/custmor/getCarData");
const {getTargetedDestnationData} = require("../../middelwares/custmor/getDynamicDestinationData");
const {getPackagesData}= require("../../middelwares/custmor/getPackagesData")

router.get("/", renderUserHomePage);
router.get("/about", renderAboutUsPage);
router.get("/packages",getPackagesData, renderPakagesPage);
router.get("/onlineBooking",getCarsData, renderOnlineBooking);
router.get("/bookAndPay/:carId",getTargetedCarData, renderBookAndPay);
router.get("/holiday", renderHolidayPage);
router.get("/enquiry",getCarsData, renderEnquiryPage);
router.get("/contactUs", renderContactUsPage);
router.get("/corporateServices", renderCorporateServicesPage);
router.get("/ourFleets", renderOurFleetPage);
router.get("/FAQ", renderFAQPage);
router.get("/testimonials", renderTestimonialsPage);
router.get("/career", renderCareerPage);
router.get("/covid-19", renderCovidPage);
router.get("/payment/success", renderPaymentSuccessPage),
router.get("/payment/cancel", renderPaymentCancelPage),
router.post("/create-checkout-session", createCheckoutSessionAndBooking);
router.post("/enquiry", saveEnquiryData )
router.get("/dynamic/:destinationId",getTargetedDestnationData, renderDynamicDestinationPage);

module.exports = router;
