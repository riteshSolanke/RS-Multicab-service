const Custmor = require("../../models/admin/adminAddNewCustmorModel");

const getAllCustmorInfo = async (req, res, next) => {
  const custmorInfo = await Custmor.find();
  if (!custmorInfo) {
    res.send("No custmor Exist (getAllCustmorInfo- middleware)");
  }
  res.locals.allCustmorInfo = custmorInfo;
  next();
};

module.exports = getAllCustmorInfo;
