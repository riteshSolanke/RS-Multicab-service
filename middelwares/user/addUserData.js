const addUserData = async (req, res, next) => {
  const user = req.session.user;
  if (req.isAuthenticated() && req.user && req.user.role == "user") {
    req.session.user = req.user;
    console.log("user session is created");
    res.locals.userInfo = req.session.user;
    console.log("User info is created");
    next();
  } else {
    console.log("User is not login since userInfo is not added");
    next();
  }
};

module.exports = addUserData;
