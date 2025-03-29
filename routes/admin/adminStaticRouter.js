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

router.get("/", renderAdminHomePage);
router.get("/addCustmor", renderAdminAddCustmorPage);
router.get("/custmors", getAllCustmorInfo, renderExistingCustmor);
router.get("/drivers", renderExistingDrivers);
router.get("/payment", renderCheckPaymentPage);

module.exports = router;
