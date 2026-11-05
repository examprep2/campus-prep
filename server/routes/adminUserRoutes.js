import express from "express";
import {
  getUsers,
  blockUser,
  unblockUser,
  deleteUser,
} from "../controllers/adminUserController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Everything in this file is for logged-in admins only
router.use(protect, adminOnly);

router.get("/", getUsers);
router.put("/:id/block", blockUser);
router.put("/:id/unblock", unblockUser);
router.delete("/:id", deleteUser);

export default router;