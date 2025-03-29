const express = require("express");
const router = express.Router();

const {
  createNewCustmor,
  adminManualCustmorLogin,
} = require("../../controllers/admin/adminServicesController");

router.get("/custmorLogin/:id", adminManualCustmorLogin);
router.post("/addCustmor", createNewCustmor);

module.exports = router;
