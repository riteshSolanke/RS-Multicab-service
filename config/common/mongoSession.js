require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongo");

const sessionConfig = session({
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production" ? true : false, // Fix for Render/localhost
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Fix for cross-domain sessions
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
    autoRemove: "interval",
    autoRemoveInterval: 10, // Clean expired sessions every 10 min
    crypto: {
      secret: process.env.SESSION_SECRET, // Encrypt session data
    },
  }),
});

module.exports = sessionConfig;
