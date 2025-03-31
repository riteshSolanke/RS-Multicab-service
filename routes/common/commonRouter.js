const express = require("express");
const router = express.Router();
const passport = require("../../config/common/passportJsConfig");
const User = require("../../models/commonModels/commonUserModel");
const Custmor = require("../../models/admin/adminAddNewCustmorModel");
const { promisify } = require("util");
const {
  renderAdminIndexPage,
  renderSigninPage,
  renderSignupPage,
  renderForgetPasswordPage,
  verifyUserEmail,
  verifyUserOtp,
  resetUserPassword,
} = require("../../controllers/common/commonController");
router.get("/", renderAdminIndexPage);
router.get("/unauth/signin", renderSigninPage);
router.get("/unauth/signup", renderSignupPage);
router.get("/unauth/forgotPassword", renderForgetPasswordPage);
// ------------------------Forget-password functionllity -----------------------------------

router.post("/unauth/forgotPassword", verifyUserEmail);
router.post("/unauth/verifyOtp", verifyUserOtp);
router.post("/unauth/resetPassword", resetUserPassword);

// ---------------------------Local Strategy for passport ------------------------------

// verify user login and signup credential

router.post("/unauth/signin", async (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .render("signin", { sms: "Unexpected error occurred" });
    }
    if (!user) {
      return res.redirect(`/unauth/signin?status=error&message=${info.sms}`);
    }

    try {
      // Convert req.login to a promise-based function
      const login = promisify(req.login).bind(req);

      try {
        await login(user); // Attempt user login
      } catch (loginError) {
        console.error("Error during req.login:", loginError);
        return res
          .status(500)
          .render("signin", { sms: "Login process failed. Please try again." });
      }

      console.log("User logged in successfully:", user);

      // Redirect only after successful login
      if (user.role === "admin") {
        return res.redirect(
          "/admin/?status=success&message=Admin Login Successful"
        );
      } else if (user.role === "custmor") {
        return res.redirect(
          "/custmor/?status=success&message=Custmor Login Successful"
        );
      } else {
        try {
          const custmorId = user.custmorId;

          if (!custmorId) {
            console.log("custmor Id is not in user object");
            throw new Error("CustmorID  missing");
          }
          const custmor = await Custmor.findOne({ custmorId: custmorId });

          if (!custmor) {
            console.log("Custmor can't be found");
            throw new Error("Custmor not found");
          }

          const redirectUrl = custmor.serviceUrlLink;

          if (!redirectUrl) {
            console.log("Redirect URL is missing in custmorData");
            throw new Error("Redirect URL missing");
          }

          return res.redirect(
            `/${redirectUrl}/?status=success&message= ${user.name} Login Successful`
          );
        } catch (redirectError) {
          console.error(
            `Error During redirecting user: ${redirectError.message}`
          );
          return res.status(500).send("Error during login redirect");
        }
      }
    } catch (error) {
      console.error("Unexpected error in login process:", error);
      return res
        .status(500)
        .render("signin", { sms: "Unexpected error. Please try again." });
    }
  })(req, res, next); // <-- Ensure passport.authenticate() is called correctly
});

// logout functionallity
router.post("/unauth/logout", (req, res) => {
  if (!req.user) {
    return res.redirect("/unauth/signin?status=error&message=No active session found");
  }

  let redirectPath = "/unauth/signin"; // Default redirect path

  // ✅ If user is a normal "user", redirect to their service URL
  if (req.user.role === "user" && req.session?.custmorInfo?.serviceUrlLink) {
    redirectPath = `/${req.session.custmorInfo.serviceUrlLink}/?status=success&message=You logged out successfully`;
  }

  console.log(`🔴 Logging out user: ${req.user.email} (Role: ${req.user.role})`);
  console.log(`🔗 Redirecting to: ${redirectPath}`);

  // Logout the user
  req.logout((err) => {
    if (err) {
      console.error("❌ Logout error:", err);
      return res.status(500).json({ message: "Error during logout" });
    }

    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error("❌ Session destroy error:", err);
        return res.status(500).json({ message: "Error destroying session" });
      }

      // Clear the session store
      req.sessionStore.destroy(req.sessionID, (err) => {
        if (err) {
          console.error("❌ Session store error:", err);
          return res.status(500).json({ message: "Error clearing session store" });
        }

        // Clear session cookie
        res.clearCookie("connect.sid", {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });

        console.log("✅ Session destroyed successfully, redirecting...");
        return res.redirect(redirectPath);
      });
    });
  });
});


// signup functionallity
router.post("/unauth/signup", async function (req, res) {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    res.locals.sms = "This User already exists";
    return res.redirect(
      "/unauth/signin?status=error&message=These user already exist"
    );
  }

  try {
    await User.create({
      custmorId: req.session.custmor._id,
      name,
      email,
      password,
    });

    return res.redirect(
      "/unauth/signin?status=success&message=You are successfully created account pls login"
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error during signup");
  }
});



module.exports = router;
