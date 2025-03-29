const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const custmorSchema = new mongoose.Schema(
  {
    custmorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    serviceUrlLink: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    custmorName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    profilePic: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone1: {
      type: String,
      required: true,
    },
    phone2: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    serviceArea: {
      type: String,
      required: true,
    },
    subscriptionPlan: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpireTime: {
      type: String,
      default: () => Date.now() + 5 * 60 * 1000,
    },
  },
  { timestamps: true }
);

custmorSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    if (this.isModified("otp")) {
      const salt = await bcrypt.genSalt(10);
      this.otp = await bcrypt.hash(this.otp, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// coustmor model

const Custmor = mongoose.model("custmorData", custmorSchema);

module.exports = Custmor;
