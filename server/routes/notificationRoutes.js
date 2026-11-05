import express from "express";
import {
  getMyNotifications,
  markRead,
  markAllRead,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect); // any logged-in user

router.get("/", getMyNotifications);
router.put("/read-all", markAllRead); // keep above "/:id/read"
router.put("/:id/read", markRead);

export default router;