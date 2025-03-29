const Custmor = require("../../models/admin/adminAddNewCustmorModel");
const User = require("../../models/commonModels/commonUserModel");

const addCustmorSession = async (req, res, next) => {
  try {
    const serviceUrlLink = req.params.serviceUrlLink;
    console.log(serviceUrlLink);
    if (!serviceUrlLink) {
      return res.status(400).json({ message: "Service URL Link is required" });
    }

    const custmor = await Custmor.findOne({ serviceUrlLink });
    console.log("joker");
    console.log(custmor);
    if (!custmor || !custmor.custmorId) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Now add User having role custmor to session

    const user = await User.findById(custmor.custmorId);

    console.log(user);

    if (req.session.custmor) {
      req.session.custmor = null;
    }

    req.session.custmor = user; // Set customer session
    console.log("custmor session created when user login ");

    next(); // Continue to next middleware or route handler
  } catch (error) {
    console.error("Error in addCustmorSession:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = addCustmorSession;
