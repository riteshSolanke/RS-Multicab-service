const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    custmorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    pick_up_point: {
      type: String,
      required: true,
    },
    drop_point: {
      type: String,
      required: true,
    },
    type_of_car: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Enquiry = mongoose.model("enquiryCollection", enquirySchema);

module.exports = { Enquiry };
