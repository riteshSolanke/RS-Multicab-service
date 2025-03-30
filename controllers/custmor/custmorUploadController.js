


const CustmorUpload = require("../../models/custmor/custmorUploadModel");
const {upload, cloudinary} = require("../../config/custmor/multerUploadConfig");
const fs = require("fs");

async function uploadToCloudinary(filePath, folder) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
    });   

    return result.secure_url; // ✅ Return the Cloudinary URL
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  return parts.slice(-2).join("/").split(".")[0]; // Extracts `folder/imageId`
};



async function uploadProfilePic(req, res) {
  const custmorId = req.session.custmor?._id;
  if (!req.file) return res.status(400).json({ sms: "No file uploaded" });

  try {
    console.log("Uploading profile picture for:", custmorId);

    // 🔹 Fetch customer data to get the old profile picture URL
    let custmor = await CustmorUpload.findOne({ custmorId });

    // 🔹 Delete old image from Cloudinary if it exists
    if (custmor && custmor.profileLogo) {
      const oldImagePublicId = custmor.profileLogo.split('/').pop().split('.')[0]; // Extract public ID
      await cloudinary.uploader.destroy(`customers/${custmorId}/profile/${oldImagePublicId}`);
      console.log("Deleted old profile picture:", oldImagePublicId);
    }

    // 🔹 Upload new image to Cloudinary
    const fileUrl = await uploadToCloudinary(req.file.path, `customers/${custmorId}/profile`);
    console.log("Uploaded new image:", fileUrl);

    // 🔹 Update database with new profile picture
    custmor = await CustmorUpload.findOneAndUpdate(
      { custmorId },
      { profileLogo: fileUrl },
      { upsert: true, new: true }
    );

    return res.redirect(`/custmor/manageWebsite?status=success&message=Profile photo uploaded&imageUrl=${fileUrl}`);
  } catch (error) {
    console.error("Error during profile picture upload:", error);
    return res.redirect("/custmor/manageWebsite?status=error&message=Error during profile photo uploading");
  }
}




// 🔹 Function to extract public ID from Cloudinary URL


async function uploadSliderImages(req, res) {
  const custmorId = req.session.custmor?._id;

  if (!req.files || Object.keys(req.files).length === 0) {
    console.log(" No files uploaded");
    return res.status(400).json({ msg: "No files uploaded" });
  }

  try {
    console.log(" Uploaded Files:", req.files); 

    // ✅ Fetch existing customer data
    const customerData = await CustmorUpload.findOne({ custmorId });

    if (!customerData) {
      console.log(" Customer data not found");
      return res.status(404).json({ msg: "Customer data not found" });
    }

    let updatedSliderImages = { ...customerData.homeSliderImg }; // Preserve existing images

    for (const [key, fileArray] of Object.entries(req.files)) {
      if (fileArray && fileArray.length > 0) {
        const imagePath = fileArray[0].path;
        const imgIndex = key.replace(/\D/g, ""); // Extract number from "slidebar-image1"

        // 🔹 If an old image exists, delete it from Cloudinary
        if (updatedSliderImages[`img${imgIndex}`]) {
          const oldImageUrl = updatedSliderImages[`img${imgIndex}`];
          const publicId = getPublicIdFromUrl(oldImageUrl);

          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
            console.log(`🗑 Deleted old image: ${oldImageUrl}`);
          }
        }

        // ✅ Upload new image to Cloudinary
        const cloudinaryUrl = await uploadToCloudinary(imagePath, `customers/${custmorId}/slider`);
        
        if (cloudinaryUrl) {
          updatedSliderImages[`img${imgIndex}`] = cloudinaryUrl;
        } else {
          console.log(`❌ Failed to upload: ${imagePath}`);
        }
      }
    }

    console.log("✅ Generated Image URLs:", updatedSliderImages);

    // ✅ Update only changed images in MongoDB
    const updatedCustomer = await CustmorUpload.findOneAndUpdate(
      { custmorId },
      { $set: { homeSliderImg: updatedSliderImages } }, 
      { upsert: true, new: true }
    );

    console.log("✅ Database Update Result:", updatedCustomer);

    return res.redirect("/custmor/manageWebsite?status=success&message=Slider images updated successfully");
  } catch (error) {
    console.error("❌ Error updating slider images:", error);
    return res.redirect("/custmor/manageWebsite?status=error&message=Error during slider image update");
  }
}


async function uploadHomePopDestinationData(req, res) {
  const { popDestinationName1, popDestinationName2, popDestinationName3, popDestinationName4 } = req.body;
  const custmorId = req.session.custmor?._id;
  if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({ sms: "No files uploaded" });

  try {
    const homePopDestinationImg = {};
    for (const [key, fileArray] of Object.entries(req.files)) {
      homePopDestinationImg[key] = await uploadToCloudinary(fileArray[0].path, `customers/${custmorId}/pop-destinations`);
    }

    const homePopSectionImg = {
      section1: { destinationName: popDestinationName1, img: homePopDestinationImg["popular-destination-img1"] },
      section2: { destinationName: popDestinationName2, img: homePopDestinationImg["popular-destination-img2"] },
      section3: { destinationName: popDestinationName3, img: homePopDestinationImg["popular-destination-img3"] },
      section4: { destinationName: popDestinationName4, img: homePopDestinationImg["popular-destination-img4"] },
    };

    await CustmorUpload.findOneAndUpdate({ custmorId }, { homePopSectionImg }, { upsert: true, new: true });
    return res.status(200).json({ message: "Home Popular Data Upload successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function uploadCarBookingData(req, res) {
  const custmorId = req.session.custmor?._id;
  if (!req.file) return res.status(400).json({ sms: "No car image uploaded" });
  console.log("🔹 File upload request received:", req.file);

  try {
    const carImage = await uploadToCloudinary(req.file.path, `customers/${custmorId}/cars`);
    const newCarInfo = { ...req.body, carImage };
    await CustmorUpload.findOneAndUpdate({ custmorId }, { $push: { carInfo: newCarInfo } }, { upsert: true, new: true });
    return res.redirect("/custmor/manageCar?status=success&message=New Car Booking Data is Attached");
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
async function uploadDestinationData(req, res) {
  const custmorId = req.session.custmor?._id;

  if (!custmorId) {
    return res.status(400).json({ message: "Customer session not found" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No destination image uploaded" });
  }

  try {
    // Upload Image to Cloudinary
    const destinationImg = await uploadToCloudinary(req.file.path, `customers/${custmorId}/destinations`);

    // Extract and format required values from request body
    const {
      destinationName,
      destinationFooterLinkName,
      destinationHtmlContent,
      addToHolidayWindow,
      addDestinationLinkToFooter,
      addToServiceHeader,
    } = req.body;

    // Convert values to proper Boolean format
    const formattedAddToHolidayPage = addToHolidayWindow === "true";
    const formattedAddDestinationLinkToFooter = addDestinationLinkToFooter === "true";
    const formattedAddToServiceHeader = addToServiceHeader === "true";

    // Decode HTML content properly
    const decodedHtmlContent = decodeURIComponent(destinationHtmlContent);

    // Create new destination object
    const newDestinationInfo = {
      destinationName,
      destinationFooterLinkName,
      destinationHtmlContent: decodedHtmlContent, // Store properly formatted HTML
      addToHolidayWindow: formattedAddToHolidayPage,
      addDestinationLinkToFooter: formattedAddDestinationLinkToFooter,
      addToServiceHeader: formattedAddToServiceHeader,
      destinationImg,
    };

    // Save data to database
    await CustmorUpload.findOneAndUpdate(
      { custmorId },
      { $push: { destinationInfo: newDestinationInfo } },
      { upsert: true, new: true }
    );

    return res.json({ sms: "Customer Destination Data uploaded successfully" });

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
