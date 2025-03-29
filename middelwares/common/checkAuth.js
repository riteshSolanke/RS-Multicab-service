async function attachUserInfo(req, res, next) {
  try {
    if (req.isAuthenticated() && req.user && req.user.role == "admin") {
      // If logged in via Passport (normal login)
      console.log(" Admin Authenticated via Passport");
      return next();
    } else if (
      req.isAuthenticated() &&
      req.user &&
      req.user.role == "custmor"
    ) {
      console.log("Custmor Authenticated via Passport ");
      req.session.custmor = req.user;
      next();
    }
  } catch (error) {
    console.error("Error in attachUserInfo middleware:", error);
    return next(error);
  }
}

function checkRole(allowedRoles) {
  return (req, res, next) => {
    try {
      const user = req.user; // User logged in via Passport
      const customer = req.session.customer; // Customer switched manually by admin

      // Check if user or customer has an allowed role
      const hasAccess =
        (user && (user.role === "admin" || allowedRoles.includes(user.role))) ||
        (customer && allowedRoles.includes(customer.role));

      if (hasAccess) {
        return next(); // Grant access
      }

      // Redirect if unauthorized
      res.redirect(
        "/unauth/signin?status=error&message=Access Denied: Insufficient Permissions"
      );
    } catch (error) {
      console.error("Error in checkRole middleware:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  };
}

module.exports = { attachUserInfo, checkRole };
