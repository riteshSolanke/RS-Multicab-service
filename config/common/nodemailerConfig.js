require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// generate random otp......
async function generateOTP() {
  const OTP = await crypto.randomInt(100000, 900000).toString();
  return OTP;
}

// create a nodmailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

module.exports = { generateOTP, transporter };
