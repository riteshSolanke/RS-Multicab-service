const fs = require("fs");
const path = require("path");
const CustmorUpload = require("../../models/custmor/custmorUploadModel");
const { cloudinary } = require("../../config/custmor/multerUploadConfig");
const Driver = require("../../models/driver/driverModel")

async function deleteExistingBookingCar(req, res) {
  try {
    const custmorId = req.session.custmor?._id;
    const carId = req.params.carId;
    console.log("deleter");

    if (!custmorId) {
      return res
        .status(400)
        .json({ message: "Customer session is not created" });
    }

    const custmorStaticData = await CustmorUpload.findOne({ custmorId });

    if (!custmorStaticData) {
      return res.status(404).json({ message: "Customer data not found" });
    }

    let carInfo = custmorStaticData.carInfo;
    let targetedCarIndex = carInfo.findIndex(
      (car) => car._id.toString() === carId
    );

    if (targetedCarIndex === -1) {
      return res.status(404).json({ message: "Car not found" });
    }

    const targetedCarData = carInfo[targetedCarIndex];
    const imageUrl = targetedCarData.carImage;

    const basePath = path.join(__dirname, "..", "..", "public"); // Adjust based on your folder structure

const absolutePath = path.join(basePath, imageUrl);

fs.access(absolutePath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error("File not found:", absolutePath);
  } else {
    fs.unlink(absolutePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Error deleting file:", unlinkErr);
      } else {
        console.log("File deleted successfully:", absolutePath);
      }
    });
  }
});

    custmorStaticData.carInfo.splice(targetedCarIndex, 1);

    await CustmorUpload.updateOne(
      { custmorId },
      { carInfo: custmorStaticData.carInfo }
    );

    return res.redirect(
      "/custmor/manageCar?status=success&message= Car Removed form Booking Page "
    );
  } catch (error) {
    console.error("Error deleting car:", error);
    return res.status(500).json({ message: "Internal server error at custmorServiceController" });
  }
}


async function addNewPackage(req, res) {
  try {
    const custmorId = req.session.custmor?._id;
    if (!custmorId) {
      return res.status(400).json({ message: "Customer session not found" });
    }

    const { packageName, ...carsData } = req.body; // Extract package name

    let cars = [];

    // Parsing cars data into structured format
    Object.keys(carsData).forEach((key) => {
      const match = key.match(/^cars\[(\d+)]\[(.+)]$/);
      if (match) {
        const index = match[1]; // Extract index number
        const field = match[2]; // Extract field name

        if (!cars[index]) cars[index] = {}; // Initialize index if not exists
        cars[index][field] = carsData[key]; // Assign field to car object
      }
    });

    let custmor = await CustmorUpload.findOne({ custmorId });

    if (!custmor) {
      custmor = new CustmorUpload({ custmorId, packagesInfo: [] });
    }

    // Check if package already exists
    let existingPackage = custmor.packagesInfo.find(pkg => pkg.packageName === packageName);

    if (existingPackage) {
      existingPackage.carInfo.push(...cars);
    } else {
      const newPackage = { packageName, carInfo: cars };
      custmor.packagesInfo.push(newPackage);
    }

    await custmor.save();
    return res.redirect(
      "/custmor/managePackage?status=success&message= New package is added successfully "
    );
  } catch (error) {
    console.error("Error adding package:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


async function deleteTargetedDestinationData(req, res) {
  const destinationId = req.params.destinationId;
  const custmorId = req.session.custmor?._id;

  if (!custmorId) {
    return res.status(400).json({ message: "Customer session not found" });
  }

  try {
    // Find the customer document
    const custmor = await CustmorUpload.findOne({ custmorId });

    if (!custmor) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Find the destination to delete
    const destinationToDelete = custmor.destinationInfo.find(
      (destination) => destination._id.toString() === destinationId
    );

    if (!destinationToDelete) {
      return res.status(404).json({ message: "Destination not found" });
    }

    // Extract Cloudinary public_id from the image URL
    const imageUrl = destinationToDelete.destinationImg;
    const publicId = imageUrl.split("/").slice(-1)[0].split(".")[0]; // Extracts Cloudinary public_id

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(`customers/${custmorId}/destinations/${publicId}`);

    // Remove the destination from the destinationInfo array
    custmor.destinationInfo = custmor.destinationInfo.filter(
      (destination) => destination._id.toString() !== destinationId
    );

    // Save the updated customer document
    await custmor.save();
    return res.redirect(
      "/custmor/manageDestination?status=success&message= Existing Destination Deleted "
    );

    return res.json({ message: "Destination deleted successfully" });
  } catch (error) {
    console.error("Error deleting destination:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function addNewDriver(req, res){
  
  try {
    const custmorId= req.session.custmor?._id;
    if(!custmorId){
      return res.status(500).json({message: "custmor session is missing error during driver information adding"});
    }
    const { name, phone, email, licenseNumber, vehicleType, vehicleNumber} = req.body;
    console.log(req.body);

    // Create new driver object
    const newDriver = new Driver({
      custmorId,
      serviceName: req.session.custmorInfo.serviceName,
      name,
      phone,
      email,
      licenseNumber,
      vehicleType,
      vehicleNumber,    
    });

    await newDriver.save();
    
    return res.redirect("/custmor/driver?status=success&message=New driver is added successfully");
  } catch (error) {
    console.error("Error adding driver:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};









module.exports = { deleteExistingBookingCar, addNewPackage, deleteTargetedDestinationData,addNewDriver };
