const bcrypt = require("bcrypt");
const Custmor = require("../../models/admin/adminAddNewCustmorModel");
const User = require("../../models/commonModels/commonUserModel");
const custmorUploadModel = require("../../models/custmor/custmorUploadModel");

async function createNewCustmor(req, res) {
  const {
    serviceName,
    custmorName,
    serviceUrlLink,
    role,
    email,
    phone1,
    phone2,
    address,
    serviceArea,
    subscriptionPlan,
    status,
    password,
    otp,
    otpExpireTime,
  } = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists in the User model
    let user = await User.findOne({ email });
    if (!user) {
      const userData = new User({
        name: custmorName,
        email,
        password: hashedPassword, // Store hashed password
        role,
      });
      user = await userData.save();
      console.log(user);
    }

    // Check if customer already exists
    const existCustmor = await Custmor.findOne({ email });
    if (existCustmor) {
      return res.redirect(
        "/admin/addCustmor?status=error&message=This customer already exists"
      );
    }

    // Create new customer
    const custmorData = new Custmor({
      custmorId: user._id,
      serviceName,
      custmorName,
      serviceUrlLink,
      role,
      email,
      phone1,
      phone2,
      address,
      serviceArea,
      subscriptionPlan,
      status,
      password: hashedPassword, // Store hashed password
      otp,
      otpExpireTime,
    });
    await custmorData.save();

    return res.redirect(
      "/admin/addCustmor?status=success&message=New customer created successfully"
    );
  } catch (err) {
    console.error("Error creating customer:", err);
    return res.redirect(
      "/admin/addCustmor?status=error&message=Internal Server Error"
    );
  }
}

async function adminManualCustmorLogin(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied" });
  }
 
  const custmor = await User.findById(req.params.id);
  console.log(custmor);

  if (!custmor) {
    return res.status(404).json({ message: "Customer not found" });
  }

  custmor.adminManualCustmorLogin= true;
  console.log(custmor);
  // Remove previous customer session
  req.session.custmor = null;
  // Assign new customer session (but don't modify req.user)
  req.session.custmor = custmor;
console.log("Custmor manual login by Admin");
  res.redirect(`/custmor/?status=success&message=${custmor.name} login`);
}

module.exports = { createNewCustmor, adminManualCustmorLogin };
