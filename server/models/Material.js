const mongoose = require("mongoose");

// A Material is one uploaded file: notes, a book, a question paper or a syllabus
const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    type: {
      type: String,
      enum: ["notes", "book", "qp", "syllabus"],
      required: true,
    },
    // Which subject this material belongs to
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    // Link to the file in cloud storage (the file itself is NOT stored in MongoDB)
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Admin approval flow: pending -> approved or rejected
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: "",
    },
    // Mainly for question papers, e.g. 2023
    examYear: {
      type: Number,
    },
    // Which admin checked it, and when
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Material", materialSchema);