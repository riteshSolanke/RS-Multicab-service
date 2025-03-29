require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../../models/commonModels/commonUserModel");

const initializeAdmin = async () => {
  try {
    console.log(`Checking for existing admin user...`);

    // Validate environment variables
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Missing required environment variables for admin user.");
    }

    // Check if admin user already exists
    const adminUser = await User.findOne({ role: "admin" });
    if (adminUser) {
      console.log(`Admin user already exists with email: ${adminUser.email}`);
      return;
    }

    console.log("Admin user not found. Creating default admin user...");

    // Hash the admin password

    // Create and save the new admin user
    const newAdmin = new User({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });

    await newAdmin.save();
    console.log("Default admin user created successfully!");
  } catch (err) {
    console.error("Error initializing admin user:", err.message);
    throw err; // Optional: rethrow the error to ensure the failure is propagated
  }
};

module.exports = initializeAdmin;
