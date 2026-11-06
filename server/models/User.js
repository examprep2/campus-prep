import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Fields that only students need (admins can skip them)
const requiredForStudent = function () {
  return this.role === "student";
};

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
      required: requiredForStudent,
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
      required: requiredForStudent,
    },
    year: {
      type: Number,
      required: requiredForStudent,
      min: 1,
      max: 4,
    },
    semester: {
      type: Number,
      required: requiredForStudent,
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

// Delete accounts that never verified their email, 24 hours after signup.
// Verified accounts don't match the filter, so they are never deleted.
userSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 24 * 60 * 60, partialFilterExpression: { isVerified: false } }
);

export default mongoose.model("User", userSchema);