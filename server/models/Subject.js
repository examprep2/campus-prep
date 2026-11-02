import mongoose from "mongoose";

// A Subject is one course, e.g. Data Structures, Sem 3, 2019 scheme
const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    // One subject can belong to many branches (e.g. first-year common subjects)
    branches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
      },
    ],
    // Syllabus revision, e.g. "2019"
    scheme: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// The same subject code can't be added twice for the same scheme
subjectSchema.index({ code: 1, scheme: 1 }, { unique: true });

module.exports = mongoose.model("Subject", subjectSchema);