import mongoose from "mongoose";
import User from "../models/User.js";
import Material from "../models/Material.js";

const serverError = (res, label, error) => {
  console.error(`${label}:`, error.message);
  return res
    .status(500)
    .json({ success: false, message: "Something went wrong. Please try again." });
};

// Make the search text safe to use inside a regular expression
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/admin/users?search=&role=&branch=&blocked=&page=&limit=
export const getUsers = async (req, res) => {
  try {
    const { search, role, branch, blocked } = req.query;
    const filter = {};

    if (role) {
      if (!["student", "admin"].includes(role)) {
        return res
          .status(400)
          .json({ success: false, message: "Role must be student or admin" });
      }
      filter.role = role;
    }

    if (branch) {
      if (!mongoose.isValidObjectId(branch)) {
        return res.status(400).json({ success: false, message: "Invalid branch id" });
      }
      filter.branch = branch;
    }

    if (blocked === "true") filter.isBlocked = true;
    if (blocked === "false") filter.isBlocked = false;

    if (search) {
      const regex = { $regex: escapeRegex(search.trim()), $options: "i" };
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 50);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-otpExpires -otpAttempts -otpSentAt -__v")
        .populate("branch", "name code")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: { users, page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return serverError(res, "Get users error", error);
  }
};

// Builds the block and unblock handlers (they only differ by true / false)
const setBlocked = (isBlocked) => async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    if (id === String(req.user._id)) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot change your own account" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role !== "student") {
      return res
        .status(400)
        .json({ success: false, message: "Only student accounts can be blocked" });
    }

    user.isBlocked = isBlocked;
    await user.save({ validateModifiedOnly: true });

    return res.status(200).json({
      success: true,
      message: isBlocked ? "User blocked" : "User unblocked",
      data: {
        user: { _id: user._id, name: user.name, email: user.email, isBlocked },
      },
    });
  } catch (error) {
    return serverError(res, "Block user error", error);
  }
};

// PUT /api/admin/users/:id/block
export const blockUser = setBlocked(true);

// PUT /api/admin/users/:id/unblock
export const unblockUser = setBlocked(false);

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    if (id === String(req.user._id)) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot delete your own account" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role !== "student") {
      return res
        .status(400)
        .json({ success: false, message: "Only student accounts can be deleted" });
    }

    // Keep the history of uploads intact: block these accounts instead of deleting them
    const uploads = await Material.countDocuments({ uploadedBy: id });
    if (uploads > 0) {
      return res.status(409).json({
        success: false,
        message:
          "This user has uploaded materials. Block the account instead of deleting it.",
      });
    }

    await user.deleteOne();
    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    return serverError(res, "Delete user error", error);
  }
};