require("dotenv").config();
const mongoose = require("mongoose");
const initializeAdmin = require("../admin/initializeAdminConfig");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB successfully");
    await initializeAdmin();
  } catch (err) {
    console.log(`Error during connecting to mongodb: ${err}`);
  }
};

module.exports = connectToDatabase;
