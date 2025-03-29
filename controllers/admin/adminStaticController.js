require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);








async function renderAdminHomePage(req, res) {
  return res.render("admin/adminHomePage", { headingName: "Dashboard" });
}

async function renderAdminAddCustmorPage(req, res) {
  return res.render("admin/adminAddCustmorPage", {
    headingName: "Add New Custmor",
  });
}
async function renderExistingCustmor(req, res) {
  return res.render("admin/adminCustmorPage", {
    headingName: "Existing Custmor",
  });
}

async function renderExistingDrivers(req, res) {
  return res.render("admin/adminDriverPage", { headingName: "Driver" });
}


async function renderCheckPaymentPage(req,res){
  try {
    const { custmorId } = req.params;

    // Fetch all payment intents from Stripe
    const paymentIntents = await stripe.paymentIntents.list();
    console.log(paymentIntents)

    // Filter payments for the specific customer
    const customerPayments = paymentIntents.data.filter(
      (payment) => payment.metadata.custmorId === custmorId
    );

    if (customerPayments.length === 0) {
      return res.status(404).send("No payments found for this customer");
    }

    // Store data in locals to pass to frontend
    res.locals.headingName= "Check Payments";
    res.locals.PaymentData = customerPayments;

    // Render the frontend page with payment data
    return res.render("admin/adminCheckPaymentPage", { PaymentData: customerPayments });

  } catch (error) {
    console.error("Error fetching Stripe payment data:", error);
    return res.status(500).send("Internal Server Error");
  }
}
module.exports = {
  renderAdminHomePage,
  renderAdminAddCustmorPage,
  renderExistingCustmor,
  renderExistingDrivers,
  renderCheckPaymentPage,
};
