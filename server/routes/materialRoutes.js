import express from "express";
import {
  getMaterials,
  getMaterialById,
  createMaterial,
} from "../controllers/materialController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getMaterials); // any logged-in user
router.get("/:id", protect, getMaterialById); // any logged-in user
router.post("/", protect, adminOnly, createMaterial); // admin only

export default router;