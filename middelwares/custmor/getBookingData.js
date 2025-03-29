const Booking = require("../../models/user/bookingModel");


const getBookingData = async function (req, res, next) {
    try {
        const custmorId = req.session.custmor._id;
        const bookingData = await Booking.find({custmorId: custmorId});

        if (!bookingData || bookingData.length === 0) {
            console.log("No Booking Data Available.");
            res.locals.bookingInfo = []; // Ensure it’s an empty array to prevent frontend errors
        } else {
            res.locals.bookingInfo = bookingData;
        }

        next();
    } catch (error) {
        console.error("Error fetching booking data:", error);
        res.status(500).json({ message: "Internal server error" }); // Send proper response
    }
};

module.exports = { getBookingData };
