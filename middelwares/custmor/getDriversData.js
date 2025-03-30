const Driver = require("../../models/driver/driverModel");

const getDriversInfo = async function (req, res, next) {
    try {
        const custmorId = req.session.custmor?._id;
        
        if (!custmorId) {
            return res.status(400).json({ message: "Customer session is not created" }); // 🛑 Added return
        }

        const driversInfo = await Driver.find({ custmorId: custmorId });

        res.locals.driversInfo = driversInfo;
        next();
    } catch (error) {
        console.error("Error fetching drivers info:", error);
        next(error);
    }
};

const getAllDriversInfo = async function (req, res, next) {
    try {
        const driverInfo = await Driver.find(); 
        res.locals.allDriversInfo = driverInfo;
        next();
    } catch (error) {
        console.error("Error fetching all drivers info:", error);
        next(error);
    }
};

module.exports = { getDriversInfo, getAllDriversInfo };
