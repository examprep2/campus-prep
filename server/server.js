// Load secret settings from the .env file
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // NEW: the database connection

// Connect to the database
connectDB(); // NEW

// Create the app
const app = express();

// Middleware: runs on every request before our routes
app.use(cors()); // allow the React app to talk to this server
app.use(express.json()); // let the server read JSON sent by the frontend

// A test route, just to check the server works
app.get("/", (req, res) => {
  res.json({ success: true, message: "Campus Prep API is running" });
});

// Pick the port from .env, or use 5000 if it's missing
const PORT = process.env.PORT || 5000;

// Start listening for requests
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});