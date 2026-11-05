import express from "express";
import {
  getMaterials,
  getMaterialById,
  createMaterial,
  uploadMaterial,
  getMyMaterials,
  getPendingMaterials,
  approveMaterial,
  rejectMaterial,
} from "../controllers/materialController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { uploadPdfFile } from "../middleware/upload.js";

const router = express.Router();

router.get("/", protect, getMaterials); // any logged-in user
router.get("/mine", protect, getMyMaterials); // keep above "/:id"
router.get("/pending", protect, adminOnly, getPendingMaterials); // keep above "/:id"
router.post("/upload", protect, uploadPdfFile, uploadMaterial); // student upload (pending)
router.get("/:id", protect, getMaterialById); // any logged-in user
router.post("/", protect, adminOnly, createMaterial); // admin adds with a link
router.put("/:id/approve", protect, adminOnly, approveMaterial);
router.put("/:id/reject", protect, adminOnly, rejectMaterial);

export default router;