import mongoose from "mongoose";
import Branch from "../models/Branch.js";

const serverError = (res, label, error) => {
  console.error(`${label}:`, error.message);
  return res
    .status(500)
    .json({ success: false, message: "Something went wrong. Please try again." });
};

// Turn duplicate and validation errors into friendly messages
const handleSaveError = (res, label, error) => {
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A branch with this name or code already exists",
    });
  }
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({ success: false, message });
  }
  return serverError(res, label, error);
};

// GET /api/branches (public: the signup page needs it)
export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find({ isActive: true }).sort({ name: 1 });
    return res.status(200).json({ success: true, data: { branches } });
  } catch (error) {
    return serverError(res, "Get branches error", error);
  }
};

// GET /api/branches/all (admin: includes hidden branches)
export const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ name: 1 });
    return res.status(200).json({ success: true, data: { branches } });
  } catch (error) {
    return serverError(res, "Get all branches error", error);
  }
};

// POST /api/branches (admin)
export const createBranch = async (req, res) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res
        .status(400)
        .json({ success: false, message: "Name and code are required" });
    }

    const branch = await Branch.create({ name, code });
    return res
      .status(201)
      .json({ success: true, message: "Branch created", data: { branch } });
  } catch (error) {
    return handleSaveError(res, "Create branch error", error);
  }
};

// PUT /api/branches/:id (admin)
export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid branch id" });
    }

    const branch = await Branch.findById(id);
    if (!branch) {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }

    const { name, code, isActive } = req.body;
    if (name !== undefined) branch.name = name;
    if (code !== undefined) branch.code = code;
    if (isActive !== undefined) branch.isActive = isActive;

    await branch.save();
    return res
      .status(200)
      .json({ success: true, message: "Branch updated", data: { branch } });
  } catch (error) {
    return handleSaveError(res, "Update branch error", error);
  }
};