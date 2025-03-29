const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    custmorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming your user model is named "User"
      required: true,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    destination: {
      type: String,
      required: true,
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
    pickUpAddress: {
      type: String,
      required: true,
    },
    date: {
      type: Date, // Changed from String to Date for better handling
      required: true,
    },
    additionalInfo: {
      type: String,
    },
    carName: {
      type: String,
      required: true,
    },
    carRent: {
      type: Number,
      required: true,
    },
    driverAllowance: {
      type: Number,
      default: 500, // Default driver charge
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Completed"],
      default: "Pending",
    },
    isBookingRead:{
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports =  Booking;
