require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Create a MongoDB session store separately
const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: "sessions",
  ttl: 24 * 60 * 60, // 1 day expiration
  autoRemove: "interval",
  autoRemoveInterval: 10, // Every 10 minutes
});

// Check for store errors
store.on("error", (error) => {
  console.error("❌ MongoStore Error:", error);
});

// Create the session configuration
const sessionConfig = session({
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", // Secure only in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
  store, // Use the created store
});

module.exports = sessionConfig;
