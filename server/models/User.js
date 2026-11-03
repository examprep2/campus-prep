import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// A User is a student or an admin
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 15,
      max: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // never sent back in queries unless we ask for it
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
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
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    isVerified: {
      type: Boolean,
      default: false, // becomes true after email OTP
    },
    isBlocked: {
      type: Boolean,
      default: false, // admin can block a user
    },
    // OTP fields (the OTP is stored hashed, never as plain text)
    otp: {
      type: String,
      select: false,
    },
    otpExpires: {
      type: Date,
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
    otpSentAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Before saving a user, turn the password into a secure hash
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Check a typed password against the saved hash (used at login)
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);