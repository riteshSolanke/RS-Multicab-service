const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  custmorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  serviceName: {
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
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Driver", driverSchema);
