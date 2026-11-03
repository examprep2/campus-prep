import express from "express";
import {
  register,
  verifyOtp,
  resendOtp,
  login,
  logout,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;