async function attachUserInfo(req, res, next) {
  console.log("🔍 Checking Session:", req.session);
  console.log("🔍 Checking req.user:", req.user);

  if (!req.isAuthenticated() || !req.user) {
    console.log("❌ User is NOT authenticated!");
    return res.redirect(
      "/unauth/signin?status=error&message=Access Denied: You are not Authenticated"
    );
  }

  if (req.user.role === "admin") {
    console.log("✅ Admin Authenticated");
    return next();
  } 

  if (req.user.role === "custmor") {
    console.log("✅ Custmor Authenticated");
    req.session.custmor = req.user; // Store customer in session
    req.session.save(err => {
      if (err) console.error("❌ Error saving session:", err);
      next();
    });
  } else {
    return res.redirect(
      "/unauth/signin?status=error&message=Access Denied: Invalid Role"
    );
  }
}


function checkRole(allowedRoles) {
  return (req, res, next) => {
    try {
      const user = req.user; 
      const customer = req.session.custmor; // Corrected key

      // Check if user or customer has an allowed role
      const hasAccess =
        (user && (user.role === "admin" || allowedRoles.includes(user.role))) ||
        (customer && allowedRoles.includes(customer.role));

      if (hasAccess) {
        return next(); // Grant access
      }

      // Redirect if unauthorized
      return res.redirect(
        "/unauth/signin?status=error&message=Access Denied: Insufficient Permissions"
      );
    } catch (error) {
      console.error("❌ Error in checkRole middleware:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  };
}

module.exports = { attachUserInfo, checkRole };
