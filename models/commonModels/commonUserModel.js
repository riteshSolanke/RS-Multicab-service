require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { text } = require("express");

const userSchema = new mongoose.Schema(
  {
    custmorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "custmor", "driver"],
    },
    googleId: {
      type: String,
    },
    githubId: {
      type: String,
    },
    otp: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// pre- save mongoose hook
userSchema.pre("save", async function (next) {
  try {
    // Hash password if modified
    if (this.isModified("password") && this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    // Hash OTP if modified
    if (this.isModified("otp") && this.otp) {
      const salt = await bcrypt.genSalt(10);
      this.otp = await bcrypt.hash(this.otp, salt);
    }

    next();
  } catch (error) {
    next(error);
  }
});

// post- save mongoose hook
userSchema.post("save", async function (doc, next) {
  console.log(`New user created : ${doc.name}`);
});

// model for userSchema

const User = mongoose.model("userCollection", userSchema);

module.exports = User;
