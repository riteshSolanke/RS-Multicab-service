const Custmor = require("../../models/admin/adminAddNewCustmorModel");

const addCustmorData = async (req, res, next) => {
  try {
    res.locals.custmorInfo = {}; // Prevent undefined errors

    if (req.session.custmor && req.session.custmor._id) {
      const custmorId = req.session.custmor._id;

      // Ensure it's a valid ObjectId
      const mongoose = require("mongoose");
      if (!mongoose.Types.ObjectId.isValid(custmorId)) {
        console.log("Invalid customer ID format:", custmorId);
        return next();
      }

      // Fetch customer by `_id`
      const custmor = await Custmor.findOne({ custmorId: custmorId });
      console.log("Fetched Customer:", custmor);

      if (!custmor) {
        console.log("Customer not found for ID:", custmorId);
        return next(); // Continue without crashing
      }

      res.locals.custmorInfo = custmor;
      req.session.custmorInfo = custmor;
      console.log("Customer info attached successfully.");
    } else {
      console.log("Customer session not found.");
    }

    return next();
  } catch (error) {
    console.error("Error fetching customer data:", error);
    return next(error);
  }
};

module.exports = addCustmorData;
