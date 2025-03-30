const CustmorUpload = require("../../models/custmor/custmorUploadModel");
const  Booking  = require("../../models/user/bookingModel");
const {Enquiry} = require("../../models/user/enquiryModel")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function renderHeader(req, res){
  return res.render('user/headerPage')
}

async function renderFooter(req, res){
  return res.render("user/footerPage");
}

async function renderUserHomePage(req, res) {
  return res.render("user/home");
}
async function renderAboutUsPage(req, res) {
  res.locals.headingName = "About Us";
  return res.render("user/about");
}
async function renderPakagesPage(req, res) {
  res.locals.headingName = "packages";
  return res.render("user/packages");
}
async function renderBookAndPay(req, res) {
  res.locals.headingName = "Book And Pay";
  return res.render("user/bookAndPay");
}


async function renderOnlineBooking(req, res) {
  res.locals.headingName = "Online Booking";
  return res.render("user/onlineBooking");
}
async function renderHolidayPage(req, res) {
  res.locals.headingName = "Holidays";
  return res.render("user/holiday");
}
async function renderEnquiryPage(req, res) {
  res.locals.headingName = "Enquiry";
  return res.render("user/enquiry");
}
async function renderContactUsPage(req, res) {
  res.locals.headingName = "Contact Us";
  return res.render("user/contactUs");
}

async function renderCorporateServicesPage(req, res) {
  res.locals.headingName = "Corporate Services";
  return res.render("user/corporateServicesPage");
}

async function renderOurFleetPage(req, res) {
  res.locals.headingName = "Our Fleets";
  return res.render("user/ourFleets");
}

async function renderFAQPage(req, res) {
  res.locals.headingName = "FAQ ";
  return res.render("user/FAQ");
}

async function renderTestimonialsPage(req, res) {
  res.locals.headingName = "Testimonials";
  return res.render("user/testimonialsPage");
}

async function renderCareerPage(req, res) {
  res.locals.headingName = "Career";
  return res.render("user/careerPage");
}

async function renderCovidPage(req, res) {
  res.locals.headingName = "Covid-19";
  return res.render("user/covid");
}

async function renderPaymentSuccessPage(req, res){
  try {
    const bookingId = req.query.bookingId;

    if (!bookingId) {
      return res.status(400).send("Invalid Booking ID.");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).send("Booking not found.");
    }

    // Update payment status to "Completed"
    booking.paymentStatus = "Completed";
    await booking.save();

    return res.render("user/paymentSuccess", { booking });
  } catch (error) {
    console.error("Error in success page:", error);
    return res.status(500).send("Internal Server Error.");
  }
}


async function renderPaymentCancelPage(req, res){
  try {
    const bookingId = req.query.bookingId;

    if (!bookingId) {
      return res.status(400).send("Invalid Booking ID.");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).send("Booking not found.");
    }

    return res.render("user/paymentCancel", { booking });
  } catch (error) {
    console.error("Error in cancel page:", error);
    return res.status(500).send("Internal Server Error.");
  }
}
async function createCheckoutSessionAndBooking(req, res) {
  try {
    const { name, phone, email, destination, pickUpAddress, date, carId } = req.body;

    const custmorId = req.session.custmor._id;
    console.log(req.body);
    console.log("custmorId:", custmorId);
    
    const custmor = await CustmorUpload.findOne({ custmorId });

    if (!custmor) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Find the car by ID
    const carInfo = custmor.carInfo.find(car => car._id.toString() === carId);
    if (!carInfo) {
      return res.status(404).json({ message: "Car not found" });
    }

    const driverAllowance = 500;
    const totalAmount = Number(carInfo.carRent) + driverAllowance;

    // Save booking data in the database before payment
    const newBooking = new Booking({
      custmorId,
      bookedBy: req.user ? req.user._id : null,
      name,
      phone,
      email,
      destination,
      pickUpAddress,
      date,
      carId,
      carName: carInfo.carName,
      carRent: carInfo.carRent,
      totalAmount,
      paymentStatus: "Pending", // Mark as pending before payment
    });

    console.log("new booking", newBooking);

    await newBooking.save();

    // Create Stripe Checkout Session in INR
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr", // Make sure it's INR for Indian users
            product_data: {
              name: `${carInfo.carName} - ${destination}`,
            },
            unit_amount: totalAmount * 100, // Convert ₹ to paise (₹1 = 100 paise)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      
      success_url: `${req.protocol}://${req.get("host")}/${req.session.custmorInfo.serviceUrlLink}/payment/success?bookingId=${newBooking._id}`,
      cancel_url: `${req.protocol}://${req.get("host")}/${req.session.custmorInfo.serviceUrlLink}/payment/cancel?bookingId=${newBooking._id}`,
    });
    console.log("Stripe Session Created:", session);

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error in createCheckoutSession:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function renderDynamicDestinationPage(req, res) {
  res.render("user/renderDynamicDestinationPage")
}

async function saveEnquiryData(req, res){ 
  console.log("enquiry");
  const custmorId = req.session.custmor._id;

  try{
    const {name,phone,email,pick_up_point,drop_point,type_of_car } = req.body;
    const enquiryData = new Enquiry( {
      custmorId: custmorId,
     enquiryBy: req.session.user?._id || "",
      name,
      phone,
      email,
      pick_up_point, 
      drop_point,
      type_of_car
    });
    await enquiryData.save();
    return res.redirect(`/${req.session.custmorInfo.serviceUrlLink}/enquiry?status=success&message=Your enquiry get uploaded... you will get response as soon as`);
    

  }catch(error){
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }


}

module.exports = {
  renderHeader,
  renderFooter,
  renderUserHomePage,
  renderAboutUsPage,
  renderPakagesPage,
  renderBookAndPay,
  renderOnlineBooking,
  renderHolidayPage,
  renderEnquiryPage,
  renderContactUsPage,
  renderCorporateServicesPage,
  renderOurFleetPage,
  renderFAQPage,
  renderTestimonialsPage,
  renderCareerPage,
  renderCovidPage,
  renderPaymentSuccessPage,
  renderPaymentCancelPage, 
  createCheckoutSessionAndBooking,
  saveEnquiryData,
  renderDynamicDestinationPage
};
