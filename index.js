const express = require("express");
const app = express();
const path = require("path");
const passport = require("./config/common/passportJsConfig");
const PORT = process.env.PORT || 3000;

//Mongodb connection
const connectToDatabase = require("./config/common/mongodbConnectionConfig");
connectToDatabase();

// Express-session configuration
const sessionConfig = require("./config/common/mongoSession");
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

// Middlewares
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/localDB", express.static(path.join(__dirname, "LocalDB")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// common Router middleware
app.get("/favicon.ico", (req, res) => res.status(204).end());
const { attachUserInfo, checkRole } = require("./middelwares/common/checkAuth");
const addCustmorData = require("./middelwares/custmor/addCustmorData");
const addCustmorStaticData = require("./middelwares/custmor/addCustmorStaticData");
const addCustmorSession = require("./middelwares/user/addCustmorSession");
const addUserData = require("./middelwares/user/addUserData");
const {getAllDestinationData} = require("./middelwares/custmor/getDynamicDestinationData");

// common Router...

const commonUserRouter = require("./routes/common/commonRouter");
app.use("/", commonUserRouter);

// admin Router...

const adminStaticRouter = require("./routes/admin/adminStaticRouter");
const adminServiceRouter = require("./routes/admin/adminServicesRouter");

app.use("/admin", checkRole(["admin"]), adminStaticRouter);
app.use("/admin/services", adminServiceRouter);

// custmor Router
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

// user Router
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

app.listen(PORT, () => console.log(`Server is running at port number ${PORT}`));
