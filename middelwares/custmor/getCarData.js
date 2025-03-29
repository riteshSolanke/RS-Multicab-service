const CustmorUpload = require("../../models/custmor/custmorUploadModel");



getCarsData = async function(req, res, next){
 
    const custmorId = req.session.custmor._id;

    try{
        const custmor = await CustmorUpload.findOne({custmorId : custmorId});
        if(!custmor){
            return res.status(404).send("custmor not found");
        }
        carInfo = custmor.carInfo;
        res.locals.carInfo = carInfo;
        next();

    }catch(error){
        console.log(error);
        next(error);
    }
}



 getTargetedCarData = async function (req, res, next){

    const custmorId = req.session.custmor._id;
    const carId = req.params.carId;
  
    try {
      // Find the customer document
      const custmor = await CustmorUpload.findOne({ custmorId: custmorId });
  
      if (!custmor) {
        return res.status(404).send("Customer not found");
      }
  
      // Find the specific car by its ID
      const carInfo = custmor.carInfo.find(car => car._id.toString() === carId);
  
      if (!carInfo) {
        return res.status(404).send("Car not found");
      }
  
      // Attach car information to locals
      res.locals.carInfo = carInfo;
      next();
      
    } catch (error) {
      console.error("Error fetching car details:", error);
      next(error)
    }
 }

 module.exports = {getCarsData, getTargetedCarData}