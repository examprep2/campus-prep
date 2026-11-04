import express from "express";
import {
  getSubjects,
  createSubject,
  updateSubject,
} from "../controllers/subjectController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getSubjects); // any logged-in user
router.post("/", protect, adminOnly, createSubject); // admin only
router.put("/:id", protect, adminOnly, updateSubject); // admin only

export default router;