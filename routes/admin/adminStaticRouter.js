const express = require("express");
const router = express.Router();
const getAllCustmorInfo = require("../../middelwares/admin/getAllCustmorInfo");
const {
  renderAdminHomePage,
  renderAdminAddCustmorPage,
  renderExistingCustmor,
  renderExistingDrivers,
  renderCheckPaymentPage
} = require("../../controllers/admin/adminStaticController");
const {getAllDriversInfo} = require("../../middelwares/custmor/getDriversData") 

router.get("/", renderAdminHomePage);
router.get("/addCustmor", renderAdminAddCustmorPage);
router.get("/custmors", getAllCustmorInfo, renderExistingCustmor);
router.get("/drivers",getAllDriversInfo, renderExistingDrivers);
router.get("/payment", renderCheckPaymentPage);

module.exports = router;
