import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import Branch from "../models/Branch.js";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;
const RESEND_COOLDOWN_SECONDS = 60;

// Make a random 6-digit code
const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

// Save a new hashed OTP on the user and email the plain code to them
const issueOtp = async (user) => {
  const otp = generateOtp();

  user.otp = await bcrypt.hash(otp, 10);
  user.otpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  user.otpAttempts = 0;
  user.otpSentAt = new Date();
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Your Campus Prep verification code",
    text: `Your verification code is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
    html: `<p>Your Campus Prep verification code is:</p>
           <h2 style="letter-spacing:4px">${otp}</h2>
           <p>It expires in ${OTP_EXPIRY_MINUTES} minutes. If you did not sign up, ignore this email.</p>`,
  });
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, age, email, password, confirmPassword, branch, year, semester } =
      req.body;

    if (!name || !age || !email || !password || !confirmPassword || !branch || !year || !semester) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Password must be at least 8 characters" });
    }

    if (!mongoose.isValidObjectId(branch)) {
      return res.status(400).json({ success: false, message: "Invalid branch" });
    }

    const branchDoc = await Branch.findOne({ _id: branch, isActive: true });
    if (!branchDoc) {
      return res.status(400).json({ success: false, message: "Branch not found" });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    if (user && user.isVerified) {
      return res
        .status(409)
        .json({ success: false, message: "An account with this email already exists" });
    }

    if (user) {
      // Signed up before but never verified: update the details and resend the code
      user.name = name;
      user.age = age;
      user.password = password;
      user.branch = branch;
      user.year = year;
      user.semester = semester;
    } else {
      user = new User({
        name,
        age,
        email: cleanEmail,
        password,
        branch,
        year,
        semester,
      });
    }

    await issueOtp(user);

    return res.status(201).json({
      success: true,
      message: "Account created. We sent a verification code to your email.",
      data: { email: user.email },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong. Please try again." });
  }
};

// POST /api/auth/verify-otp
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and code are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+otp");

    if (!user || !user.otp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired code" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "This account is already verified" });
    }

    if (user.otpExpires < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Code expired. Please request a new one." });
    }

    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
      return res.status(429).json({
        success: false,
        message: "Too many wrong attempts. Please request a new code.",
      });
    }

    const isMatch = await bcrypt.compare(String(otp), user.otp);

    if (!isMatch) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ success: false, message: "Incorrect code" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Email verified. You can now log in." });
  } catch (error) {
    console.error("Verify OTP error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong. Please try again." });
  }
};

// POST /api/auth/resend-otp
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Same answer whether or not the account exists, so nobody can probe for emails
    const genericReply = {
      success: true,
      message: "If this account needs verification, a new code has been sent.",
    };

    if (!user || user.isVerified) {
      return res.status(200).json(genericReply);
    }

    if (
      user.otpSentAt &&
      Date.now() - user.otpSentAt.getTime() < RESEND_COOLDOWN_SECONDS * 1000
    ) {
      return res.status(429).json({
        success: false,
        message: `Please wait ${RESEND_COOLDOWN_SECONDS} seconds before asking for a new code.`,
      });
    }

    await issueOtp(user);
    return res.status(200).json(genericReply);
  } catch (error) {
    console.error("Resend OTP error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong. Please try again." });
  }
};

// ---------- Login, logout and current user ----------

const cookieOptions = {
  httpOnly: true, // JavaScript in the browser can't read it
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
      "+password"
    );

    // Same message for "no such user" and "wrong password"
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
        data: { needsVerification: true, email: user.email },
      });
    }

    if (user.isBlocked) {
      return res
        .status(403)
        .json({ success: false, message: "Your account has been blocked" });
    }

    res.cookie("token", signToken(user), cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged in",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          branch: user.branch,
          year: user.year,
          semester: user.semester,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong. Please try again." });
  }
};

// POST /api/auth/logout
export const logout = (req, res) => {
  res.clearCookie("token", { ...cookieOptions, maxAge: undefined });
  return res.status(200).json({ success: true, message: "Logged out" });
};

// GET /api/auth/me  (needs the protect middleware)
export const getMe = async (req, res) => {
  const user = await req.user.populate("branch", "name code");
  return res.status(200).json({ success: true, data: { user } });
};