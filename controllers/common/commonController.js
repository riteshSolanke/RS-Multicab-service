const User = require("../../models/commonModels/commonUserModel");
const bcrypt = require("bcrypt");
const {
  generateOTP,
  transporter,
} = require("../../config/common/nodemailerConfig");

// function for Rendering Static Page
async function renderAdminIndexPage(req, res) {
  return res.render("admin/adminIndexPage");
}

async function renderSigninPage(req, res) {
  return res.render("common/signin");
}

async function renderSignupPage(req, res) {
  return res.render("common/signup");
}

async function renderForgetPasswordPage(req, res) {
  return res.render("common/forgotPassword");
}

// function otp verification
async function verifyUserEmail(req, res) {
  const { email } = req.body;
  const otp = await generateOTP();
  const expireAt = new Date(Date.now() + 2 * 60 * 1000);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("hello");
      res.locals.verifyOtp = false;
      res.locals.resetPass = false;
      res.locals.sms = "Invalid Email ID";
      return res.render("common/forgotPassword");
    }
    user.otp = otp;
    user.expireAt = expireAt;
    await user.save();

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: user.email,
      sub: `Your OTP for password reset`,
      text: "Hello to myself!",
      html: `<p>Your OTP is <b>${otp}.</b> It is valid for only two minutes</p>`,
    });
    res.locals.userEmail = user.email;
    res.locals.verifyOtp = true;
    res.locals.resetPassword = false;
    res.locals.sms = "OTP was sent to your email account";

    return res.render("common/forgotPassword");
  } catch (err) {
    console.log(err);
  }
}

async function verifyUserOtp(req, res) {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email: email });

    const verifiedOtp = await bcrypt.compare(otp, user.otp);

    if (!verifiedOtp) {
      res.locals.userEmail = user.email;
      res.locals.verifyOtp = true;
      res.locals.resetPassword = false;
      res.locals.sms = "Invalid OTP. Please enter the correct OTP.";
      return res.render("common/forgotPassword");
    }
    res.locals.userEmail = user.email;
    res.locals.verifyOtp = false;
    res.locals.resetPassword = true;
    res.locals.sms = "Enter new password to reset";
    return res.render("common/forgotPassword");
  } catch (err) {
    console.log(`Error during OTP verification: ${err}`);
  }
}

async function resetUserPassword(req, res) {
  const { email, newPassword } = req.body;
  console.log(email);
  console.log(newPassword);

  try {
    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();

    return res.redirect(
      "/unauth/signin?status=success&message=Your password is reset"
    );
  } catch (err) {
    console.log(`Error During Reseting Password ${err}`);
  }
}

module.exports = {
  renderAdminIndexPage,
  renderSigninPage,
  renderSignupPage,
  renderForgetPasswordPage,
  verifyUserEmail,
  verifyUserOtp,
  resetUserPassword,
};
