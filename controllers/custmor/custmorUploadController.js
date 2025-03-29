const CustmorUpload = require("../../models/custmor/custmorUploadModel");

async function uploadProfilePic(req, res) {
  const custmorId = req.session.custmor?._id;
  const folderType = req.params.folderType;

  if (!req.file) {
    return res.status(400).json({ sms: "No file uploaded" });
  }

  const fileUrl = `/localDB/${custmorId}/${folderType}/${req.file.filename}`;
  console.log(fileUrl);

  try {
    let custmor = await CustmorUpload.findOne({ custmorId: custmorId });

    if (!custmor) {
      custmor = new CustmorUpload({ custmorId });
      await custmor.save();
      console.log("Default custmor created at CustmorUpload");
    }

    custmor.profileLogo = fileUrl;
    console.log("profile url is saved at atlas");
    await custmor.save();
    return res.redirect(
      "/custmor/manageWebsite?status=success&message= Profile photo uploaded"
    );
  } catch (error) {
    return res.redirect(
      "/custmor/manageWebsite?status=error&message=Error during profile photo uploading"
    );
  }
}

async function uploadSliderImages(req, res) {
  const custmorId = req.session.custmor?._id;
  const folderType = req.params.folderType;

  //  Ensure files exist
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ sms: "No files uploaded" });
  }

  const homeSliderImg = {};

  // Map each uploaded file to its corresponding field in homeSliderImg
  Object.keys(req.files).forEach((key, index) => {
    if (index < 6) {
      homeSliderImg[
        `img${index + 1}`
      ] = `/localDB/${custmorId}/${folderType}/${req.files[key][0].filename}`;
    }
  });

  try {
    let custmor = await CustmorUpload.findOne({ custmorId });

    if (!custmor) {
      custmor = new CustmorUpload({ custmorId });
      await custmor.save();
      console.log("New customer created in CustmorUpload");
    }

    //  Update only the homeSliderImg field
    custmor.homeSliderImg = homeSliderImg;
    await custmor.save();
    console.log("Slider images saved successfully");

    return res.redirect(
      "/custmor/manageWebsite?status=success&message=slider images uploaded successfully"
    );
  } catch (error) {
    console.error("Error uploading files:", error);
    return res.redirect(
      "/custmor/manageWebsite?status=error$message=Error during slider images uploading"
    );
  }
}

async function uploadHomePopDestinationData(req, res) {
  const {
    popDestinationName1,
    popDestinationName2,
    popDestinationName3,
    popDestinationName4,
  } = req.body;
  const custmorId = req.session.custmor?._id;
  const folderType = req.params.folderType;

  //  Ensure files exist
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ sms: "No files uploaded" });
  }

  const homePopDestinationImg = {};

  // Map each uploaded file to its corresponding field in homeSliderImg
  Object.keys(req.files).forEach((key, index) => {
    if (index < 5) {
      homePopDestinationImg[
        `img${index + 1}`
      ] = `/localDB/${custmorId}/${folderType}/${req.files[key][0].filename}`;
    }
  });
  const homePopSectionImg = {
    section1: {
      destinationName: popDestinationName1,
      img: homePopDestinationImg.img1,
    },
    section2: {
      destinationName: popDestinationName2,
      img: homePopDestinationImg.img2,
    },
    section3: {
      destinationName: popDestinationName3,
      img: homePopDestinationImg.img3,
    },
    section4: {
      destinationName: popDestinationName4,
      img: homePopDestinationImg.img4,
    },
  };
  try {
    let custmor = await CustmorUpload.findOne({ custmorId });

    if (!custmor) {
      custmor = new CustmorUpload({ custmorId });
      await custmor.save();
      console.log("New customer created in CustmorUpload");
    }

    //  Update only the homeSliderImg field
    custmor.homePopSectionImg = homePopSectionImg;
    await custmor.save();
    console.log("Slider images saved successfully");

    return res.status(200).json({
      message: "Home Popular Data Upload successful",
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function uploadCarBookingData(req, res) {
  console.log(req.session.custmor);
  const custmorId = req.session.custmor?._id;
  const folderType = req.params.folderType;

  if (!custmorId) {
    console.log("Customer session is not created");
    return res.status(400).json({ sms: "Customer session not found" });
  }

  // Ensure file is uploaded
  if (!req.file) {
    return res.status(400).json({ sms: "No car image uploaded" });
  }

  const carImage = `/localDB/${custmorId}/${folderType}/${req.file.filename}`;

  const {
    carName,
    seatCapacity,
    bagCapacity,
    isAC,
    petAllowed,
    inclustions,
    exclustions,
    driverAllowance,
    carRent,
  } = req.body;

  try {
    let custmor = await CustmorUpload.findOne({ custmorId });

    if (!custmor) {
      custmor = new CustmorUpload({ custmorId });
      custmor = await custmor.save();
      console.log("new custmor created during upload");
    }
    const newCarInfo = {
      carName,
      seatCapacity,
      bagCapacity,
      isAC,
      petAllowed,
      inclustions,
      exclustions,
      driverAllowance,
      carRent,
      carImage,
    };
    custmor.carInfo.push(newCarInfo);
    await custmor.save();
    console.log("Car booking data saved successfully");

    return res.redirect(
      "/custmor/manageCar?status=success&message=New Car Booking Data is Attached"
    );
  } catch (err) {
    console.log(err);
    throw Error();
  }
}
async function uploadDestinationData(req, res) {
  const custmorId = req.session.custmor?._id;
  console.log("destination upload data");
  console.log(req.body);

  if (!custmorId) {
    console.log("Customer session does not exist");
    return res.status(400).json({ message: "Customer session not found" });
  }

  const folderType = req.params.folderType; // Fix missing folderType
  const {
    destinationName,
    destinationFooterLinkName,
    destinationHtmlContent, // Fixed typo
    addToHolidayWindow,
    addDestinationLinkToFooter,
    addToServiceHeader,
  } = req.body;
  const formattedAddToHolidayPage = addToHolidayWindow === "true";
  const formattedAddDestinationLinkToFooter =
    addDestinationLinkToFooter === "true";
  const formattedAddToServiceHeader = addToServiceHeader === "true";
  const decodedHtmlContent = decodeURIComponent(destinationHtmlContent);
  if (!req.file) {
    return res.status(400).json({ message: "No destination image uploaded" });
  }

  const destinationImg = `/localDB/${custmorId}/${folderType}/${req.file.filename}`;

  try {
    let custmor = await CustmorUpload.findOne({ custmorId });

    if (!custmor) {
      custmor = new CustmorUpload({ custmorId });
      await custmor.save(); // Ensure it's saved properly
      console.log("New customer created during upload");
    }

    const newDestinationInfo = {
      destinationName,
      destinationFooterLinkName,
      destinationHtmlContent:decodedHtmlContent, // Fixed typo
      addToHolidayWindow: formattedAddToHolidayPage, // Convert to Boolean
      addDestinationLinkToFooter: formattedAddDestinationLinkToFooter,
      addToServiceHeader: formattedAddToServiceHeader,
      destinationImg,
    };
    console.log(newDestinationInfo);

    custmor.destinationInfo.push(newDestinationInfo);
    await custmor.save();
    console.log("Customer Destination Info saved");

    return res.json({sms: "custmor Destination Data uploaded successfully"});
      
   
  } catch (err) {
    console.error("Error uploading destination data:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  uploadProfilePic,
  uploadSliderImages,
  uploadHomePopDestinationData,
  uploadCarBookingData,
  uploadDestinationData,
};
