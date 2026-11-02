import mongoose from "mongoose";

// A Branch is a department, e.g. Computer Engineering (COMPS)
const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

export default mongoose.model("Branch", branchSchema);