import mongoose from "mongoose";

// A Notification is a short in-app message for one student
const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["upload_approved", "upload_rejected", "admin_message"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    // Set for approve / reject notices, so the frontend can link to the upload
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // Which admin sent it (for admin messages)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);