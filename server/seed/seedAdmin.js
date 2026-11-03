import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";

const seedAdmin = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first");
    process.exit(1);
  }

  await connectDB();

  const email = ADMIN_EMAIL.toLowerCase().trim();
  const existing = await User.findOne({ email });

  if (existing) {
    // The account already exists, so just make it an admin
    existing.role = "admin";
    existing.isVerified = true;
    existing.isBlocked = false;
    await existing.save();
    console.log("Existing user promoted to admin");
  } else {
    await User.create({
      name: ADMIN_NAME || "Admin",
      email,
      password: ADMIN_PASSWORD,
      role: "admin",
      isVerified: true,
    });
    console.log("Admin account created");
  }

  await mongoose.connection.close();
  process.exit(0);
};

seedAdmin();