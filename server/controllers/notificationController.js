import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

const serverError = (res, label, error) => {
  console.error(`${label}:`, error.message);
  return res
    .status(500)
    .json({ success: false, message: "Something went wrong. Please try again." });
};

// GET /api/notifications?unread=true&page=1&limit=20 (the logged-in user's own)
export const getMyNotifications = async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.unread === "true") filter.isRead = false;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 50);

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Notification.countDocuments(filter),
      Notification.countDocuments({ user: req.user._id, isRead: false }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return serverError(res, "Get notifications error", error);
  }
};

// PUT /api/notifications/:id/read
export const markRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid notification id" });
    }

    // The user filter means nobody can touch someone else's notification
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    return res.status(200).json({ success: true, data: { notification } });
  } catch (error) {
    return serverError(res, "Mark read error", error);
  }
};

// PUT /api/notifications/read-all
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );
    return res
      .status(200)
      .json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    return serverError(res, "Mark all read error", error);
  }
};

// POST /api/admin/users/:id/message (admin sends a message to one student)
export const sendAdminMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const title = (req.body.title || "").trim();
    const message = (req.body.message || "").trim();

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    if (!title || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Title and message are required" });
    }

    if (title.length > 100 || message.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Title can be 100 characters and message 500 characters at most",
      });
    }

    if (!(await User.exists({ _id: id }))) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const notification = await Notification.create({
      user: id,
      type: "admin_message",
      title,
      message,
      createdBy: req.user._id,
    });

    return res
      .status(201)
      .json({ success: true, message: "Message sent", data: { notification } });
  } catch (error) {
    return serverError(res, "Send message error", error);
  }
};