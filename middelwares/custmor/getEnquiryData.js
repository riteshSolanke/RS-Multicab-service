const { Enquiry } = require("../../models/user/enquiryModel");

const getEnquiryData = async function (req, res, next) {
    const custmorId = req.session.custmor?._id; // Ensure custmorId exists

    if (!custmorId) {
        res.locals.enquirySms = "Customer ID not found";
                return next();
    }

    try {
        // Fetch multiple enquiries using `find()`
        const enquiryData = await Enquiry.find({ custmorId: custmorId });
        console.log(custmorId);
        console.log("enquirry middelware");
        console.log(enquiryData);
        // If no enquiry data found, set an empty array
        if (!enquiryData || enquiryData.length === 0) {
            res.locals.enquirySms = "No Enquiry Data Available";
           
        } else {
            res.locals.enquiryInfo = enquiryData; // Set the data
        }

        next();
    } catch (error) {
        console.error("Error fetching enquiry data:", error);
        next(error);
    }
};

module.exports = { getEnquiryData };
