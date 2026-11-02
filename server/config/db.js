import dns from "dns";
import mongoose from "mongoose";

// Use Google's DNS to look up the Atlas address (fixes querySrv ECONNREFUSED)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB is connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Mongo-DB connection error", error.message);
    // Stop the server, because it can't work without the database
    process.exit(1);
  }
};

export default connectDB;