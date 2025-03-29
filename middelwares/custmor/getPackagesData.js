const CustmorUpload = require("../../models/custmor/custmorUploadModel");


const getPackagesData = async function(req, res, next){
     const custmorId = req.session.custmor?._id;
      try{
         const custmor = await CustmorUpload.findOne({custmorId: custmorId});
         if(!custmor){
           return res.status(404).send("custmor Not Found");
         }
         const packagesInfo = custmor.packagesInfo;
         res.locals.packagesInfo = packagesInfo;
         next();
       }catch(error){
         console.log(error);
         next(error);
       }


}



module.exports = {getPackagesData}