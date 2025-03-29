const mongoose = require("mongoose");
const custmorUploadData = require("../../models/custmor/custmorUploadModel");

const addCustmorStaticData = async (req, res, next) => {
  try {
    // Check if customer session exists
    if (!req.session.custmor || !req.session.custmor._id) {
      return res.status(400).json({ error: "Customer session not found" });
    }

    const custmorId = req.session.custmor._id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(custmorId)) {
      return next(new Error("Invalid Customer ID"));
    }

    // Try to find customer data
    let custmor = await custmorUploadData.findOne({ custmorId: custmorId });
    
    // If customer data is not found, create a new one
    if (!custmor) {
      console.log("Customer data not available. Creating new entry.");
      custmor = new custmorUploadData({ custmorId });
      custmor = await custmor.save();
    }

 
    res.locals.custmorStaticData = custmor;
    console.log("static data is attached");
    next();
  } catch (error) {
    console.error("Error in addCustmorStaticData middleware:", error);
    next(error);
  }
};

module.exports = addCustmorStaticData;
