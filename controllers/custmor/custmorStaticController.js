require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


async function renderCustmorHomePage(req, res) {
  res.locals.headingName = "Dashboard";
  return res.render("custmor/custmorHomePage");
}

async function renderManageWebsitePage(req, res) {
  res.locals.headingName = "Manage Website";
  return res.render("custmor/manageCustmorWebsite");
}
async function renderManageCarPage(req, res) {
  res.locals.headingName = "Manage Car";
  return res.render("custmor/custmorManageCarPage");
}

async function renderAddCustmorCarPage(req, res) {
  res.locals.headingName = "Add New Car";
  return res.render("custmor/custmorAddCarPage");
}

async function renderDeleteCarPage(req, res) {
  res.locals.headingName = "Delete Car ";
  return res.render("custmor/custmorDeleteCarPage");
}

async function renderManageDestinationPage(req, res) {
  res.locals.headingName = "Manage Destination";
  return res.render("custmor/custmorManageDestination");
}
async function renderAddDestinationPage(req, res) {
  res.locals.headingName = "Add Destination";
  return res.render("custmor/custmorAddDestinationPage");
}
async function renderDeleteDestinationPage(req, res) {
  res.locals.headingName = "Delete Destination";
  return res.render("custmor/custmorDeleteDestinationPage");
}
async function renderDestinationControlPage(req, res) {
  res.locals.headingName = "Destination Control";
  return res.render("custmor/custmorDestinationControlPage");
}
async function renderCustmorBookingPage(req,res){
  res.locals.headingName ="Bookings"
 return res.render("custmor/custmorBookingPage")  
}

async function renderCheckEnquiryPage(req, res){
  res.locals.headingName ="Enquiry";
  return res.render("custmor/custmorCheckEnquiryPage");
}

async function renderManagePackagePage(req, res){
  res.locals.headingName = "Manage Packages"
  return res.render("custmor/custmorManagePackage")
}



module.exports = {
  renderCustmorHomePage,
  renderManageWebsitePage,
  renderManageCarPage,
  renderAddCustmorCarPage,
  renderDeleteCarPage,
  renderManageDestinationPage,
  renderAddDestinationPage,
  renderDeleteDestinationPage,
  renderDestinationControlPage,
  renderCustmorBookingPage,
  renderCheckEnquiryPage,
  renderManagePackagePage
};
