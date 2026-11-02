const dns = require("dns");
const mongoose = require("mongoose");

// Use Google's DNS to look up the Atlas address (fixes querySrv ECONNREFUSED)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    // Connect using the link stored in the .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // Stop the server, because it can't work without the database
    process.exit(1);
  }
};

module.exports = connectDB;