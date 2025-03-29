require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongo");

const sessionConfig = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
});

module.exports = sessionConfig;
