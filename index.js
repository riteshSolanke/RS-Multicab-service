const express = require("express");
const app = express();
const path = require("path");
const passport = require("./config/common/passportJsConfig");
const PORT = process.env.PORT || 3000;

// ✅ Fix for Render: Trust reverse proxy
app.set("trust proxy", 1);

// ✅ MongoDB connection
const connectToDatabase = require("./config/common/mongodbConnectionConfig");
connectToDatabase();

// ✅ Express-session configuration
const sessionConfig = require("./config/common/mongoSession");
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

// ✅ Debugging logs to check session & user
app.use((req, res, next) => {
  console.log("🔍 Checking Session:", req.session);
  console.log("🔍 Checking req.user:", req.user);
  
  // 🔁 Manually restoring req.user if missing
  if (!req.user && req.session.passport) {
    req.user = req.session.passport.user;
    console.log("🔄 Manually Restored User:", req.user);
  }
  
  next();
});

// ✅ Middlewares
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/localDB", express.static(path.join(__dirname, "LocalDB")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ✅ Common Router middleware
app.get("/favicon.ico", (req, res) => res.status(204).end());
const { attachUserInfo, checkRole } = require("./middelwares/common/checkAuth");
const addCustmorData = require("./middelwares/custmor/addCustmorData");
const addCustmorStaticData = require("./middelwares/custmor/addCustmorStaticData");
const addCustmorSession = require("./middelwares/user/addCustmorSession");
const addUserData = require("./middelwares/user/addUserData");
const { getAllDestinationData } = require("./middelwares/custmor/getDynamicDestinationData");

// ✅ Common Router
const commonUserRouter = require("./routes/common/commonRouter");
app.use("/", commonUserRouter);

// ✅ Admin Routers
const adminStaticRouter = require("./routes/admin/adminStaticRouter");
const adminServiceRouter = require("./routes/admin/adminServicesRouter");
app.use("/admin", checkRole(["admin"]), adminStaticRouter);
app.use("/admin/services", adminServiceRouter);

// ✅ Custmor Routers
const custmorStaticRouter = require("./routes/custmor/custmorStaticRouter");
const custmorServicesRouter = require("./routes/custmor/custmorServicesRouter");
const custmorUploadRouter = require("./routes/custmor/custmorUploadRouter");

app.use(
  "/custmor",
  attachUserInfo,
  checkRole(["admin", "custmor"]),
  addCustmorData,
  addCustmorStaticData,
  custmorStaticRouter
);
app.use(
  "/custmor/services",
  attachUserInfo,
  checkRole(["admin", "custmor"]),
  addCustmorData,
  custmorServicesRouter
);
app.use("/custmor/upload/:folderType", custmorUploadRouter);

// ✅ User Router
const userStaticRouter = require("./routes/user/userStaticRouter");

app.use(
  "/:serviceUrlLink",
  addCustmorSession,
  addUserData,
  addCustmorData,
  addCustmorStaticData,
  getAllDestinationData,
  userStaticRouter
);

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server is running at port ${PORT}`));
