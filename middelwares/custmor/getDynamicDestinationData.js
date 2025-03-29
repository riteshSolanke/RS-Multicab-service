const CustmorUpload = require("../../models/custmor/custmorUploadModel");


 getTargetedDestnationData = async function (req, res, next){

    const custmorId = req.session.custmor._id;
    const destinationId = req.params.destinationId;
  
    try {
      // Find the customer document
      const custmor = await CustmorUpload.findOne({ custmorId: custmorId });
  
      if (!custmor) {
        return res.status(404).send("Customer not found");
      }
  
      // Find the specific car by its ID
      const destinationInfo = custmor.destinationInfo.find(destination => destination._id.toString() === destinationId);
  
      if (!destinationInfo) {
        return res.status(404).send("Destination not found");
      }
  
   
      // Attach car information to locals
      res.locals.targetedDestinationInfo = destinationInfo;
      next();
      
    } catch (error) {
      console.error("Error fetching Destination details:", error);
      next(error)
    }
 }

 const getAllDestinationData = async function(req, res,next){
  const custmorId = req.session.custmor._id;
  try{
    const custmor = await CustmorUpload.findOne({custmorId: custmorId});
    if(!custmor){
      return res.status(404).send("custmor Not Found");
    }
    const destinationInfo = custmor.destinationInfo;
    res.locals.destinationInfo = destinationInfo;
    next();
  }catch(error){
    console.log(error);
    next(error);
  }

 }

 module.exports = { getTargetedDestnationData , getAllDestinationData};