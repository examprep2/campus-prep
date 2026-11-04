import express from "express";
import {
  getBranches,
  getAllBranches,
  createBranch,
  updateBranch,
} from "../controllers/branchController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getBranches); // anyone (the signup page needs it)
router.get("/all", protect, adminOnly, getAllBranches); // admin only
router.post("/", protect, adminOnly, createBranch); // admin only
router.put("/:id", protect, adminOnly, updateBranch); // admin only

export default router;