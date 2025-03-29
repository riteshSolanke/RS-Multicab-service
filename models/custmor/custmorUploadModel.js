const mongoose = require("mongoose");

const addCarInfoSchema = mongoose.Schema({
  carName: { type: String, required: true },
  seatCapacity: { type: String, required: true },
  bagCapacity: { type: String, required: true },
  isAC: { type: String, required: true },
  petAllowed: { type: String, required: true },
  inclustions: { type: String, required: true },
  exclustions: { type: String, required: true },
  carRent: { type: String, required: true },
 
  carImage: { type: String, required: true },
});

const addDestinationInfoSchema = mongoose.Schema({
  destinationName: { type: String, required: true },
  destinationFooterLinkName: { type: String, required: true },
  destinationHtmlContent: { type: String, required: true },
  addToHolidayWindow: { type: Boolean, default: true },
  addDestinationLinkToFooter: { type: Boolean, default: true },
  addToServiceHeader: { type: Boolean, default: true },
  destinationImg: { type: String, required: true },
});

const packageCarInfoSchema = mongoose.Schema({
  carName: { type: String, required: true },
  seatCapacity: { type: String, required: true },
  packageRent: { type: String, required: true },
  perKmCharges: { type: String, required: true },
  driverAllowance: { type: String, required: true },
  carImage: { type: String, required: false },
});

// Package Schema (Contains multiple cars)
const addPackagesInfoSchema = mongoose.Schema({
  packageName: { type: String, required: true },
  carInfo: [packageCarInfoSchema],  
});

const custmorUploadSchema = mongoose.Schema({
  custmorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  profileLogo: {
    type: String,
    default: null,
  },
  homeSliderImg: {
    img1: { type: String, default: null },
    img2: { type: String, default: null },
    img3: { type: String, default: null },
    img4: { type: String, default: null },
    img5: { type: String, default: null },
    img6: { type: String, default: null },
  },
  homePopSectionImg: {
    section1: {
      destinationName: { type: String, default: null },
      img: { type: String, default: null },
    },
    section2: {
      destinationName: { type: String, default: null },
      img: { type: String, default: null },
    },
    section3: {
      destinationName: { type: String, default: null },
      img: { type: String, default: null },
    },
    section4: {
      destinationName: { type: String, default: null },
      img: { type: String, default: null },
    },
  },
  carInfo: [addCarInfoSchema],
  destinationInfo: [addDestinationInfoSchema],
  packagesInfo: [addPackagesInfoSchema],
});

module.exports = mongoose.model("CustmorUpload", custmorUploadSchema);
