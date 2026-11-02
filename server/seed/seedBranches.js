import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Branch from "../models/Branch.js";

// The starting list of branches. More can be added later.
const branches = [
  { name: "Computer Engineering", code: "COMPS" },
  { name: "Artificial Intelligence and Machine Learning", code: "AIML" },
  { name: "Information Technology", code: "IT" },
  { name: "Electronical", code: "ELEX" },
  { name: "Mechanical Engineering", code: "MECH" },
  { name: "Automobile Engineering", code: "AUTO" },
];

const seedBranches = async () => {
  await connectDB();

  for (const branch of branches) {
    // If a branch with this code exists, update it. If not, create it.
    await Branch.updateOne(
      { code: branch.code },
      { $set: branch },
      { upsert: true }
    );
  }

  console.log(`Seeded ${branches.length} branches`);
  await mongoose.connection.close();
  process.exit(0);
};

seedBranches();