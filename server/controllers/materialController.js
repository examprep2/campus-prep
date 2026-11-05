import mongoose from "mongoose";
import Material from "../models/Material.js";
import Subject from "../models/Subject.js";
import uploadPdf from "../utils/uploadToCloudinary.js";

const MATERIAL_TYPES = ["notes", "book", "qp", "syllabus"];

const serverError = (res, label, error) => {
  console.error(`${label}:`, error.message);
  return res
    .status(500)
    .json({ success: false, message: "Something went wrong. Please try again." });
};

// Make the search text safe to use inside a regular expression
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Only accept links that start with https://
const isHttpsUrl = (value) => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};

// GET /api/materials?subject=ID&type=notes&search=text&page=1&limit=20
export const getMaterials = async (req, res) => {
  try {
    const { subject, type, search } = req.query;
    const filter = { status: "approved" }; // students only ever see approved items

    if (subject) {
      if (!mongoose.isValidObjectId(subject)) {
        return res.status(400).json({ success: false, message: "Invalid subject id" });
      }
      filter.subject = subject;
    }

    if (type) {
      if (!MATERIAL_TYPES.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `Type must be one of: ${MATERIAL_TYPES.join(", ")}`,
        });
      }
      filter.type = type;
    }

    if (search) {
      filter.title = { $regex: escapeRegex(search.trim()), $options: "i" };
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 50);

    const [materials, total] = await Promise.all([
      Material.find(filter)
        .populate("subject", "name code year semester")
        .populate("uploadedBy", "name")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Material.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: { materials, page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return serverError(res, "Get materials error", error);
  }
};

// GET /api/materials/:id
export const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid material id" });
    }

    const material = await Material.findById(id)
      .populate("subject", "name code year semester")
      .populate("uploadedBy", "name");

    // Students can only open approved materials; admins can open any
    if (!material || (material.status !== "approved" && req.user.role !== "admin")) {
      return res.status(404).json({ success: false, message: "Material not found" });
    }

    return res.status(200).json({ success: true, data: { material } });
  } catch (error) {
    return serverError(res, "Get material error", error);
  }
};

// POST /api/materials (admin: adds an already-approved material using a file link)
export const createMaterial = async (req, res) => {
  try {
    const { title, description, type, subject, fileUrl, examYear } = req.body;

    if (!title || !type || !subject || !fileUrl) {
      return res.status(400).json({
        success: false,
        message: "Title, type, subject and file link are required",
      });
    }

    if (!MATERIAL_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Type must be one of: ${MATERIAL_TYPES.join(", ")}`,
      });
    }

    if (!mongoose.isValidObjectId(subject) || !(await Subject.exists({ _id: subject }))) {
      return res.status(400).json({ success: false, message: "Subject not found" });
    }

    if (!isHttpsUrl(fileUrl)) {
      return res
        .status(400)
        .json({ success: false, message: "The file link must start with https://" });
    }

    const material = await Material.create({
      title,
      description,
      type,
      subject,
      fileUrl,
      examYear,
      uploadedBy: req.user._id,
      status: "approved", // an admin's own upload needs no review
      reviewedBy: req.user._id,
      reviewedAt: new Date(),
    });

    return res
      .status(201)
      .json({ success: true, message: "Material added", data: { material } });
  } catch (error) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((e) => e.message)
        .join(", ");
      return res.status(400).json({ success: false, message });
    }
    return serverError(res, "Create material error", error);
  }
};

// POST /api/materials/upload (any logged-in student; saved as "pending")
export const uploadMaterial = async (req, res) => {
  try {
    const { title, description, type, subject, examYear } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please choose a PDF file" });
    }

    // A real PDF always starts with the characters %PDF
    if (req.file.buffer.subarray(0, 4).toString() !== "%PDF") {
      return res
        .status(400)
        .json({ success: false, message: "The file is not a valid PDF" });
    }

    if (!title || !type || !subject) {
      return res
        .status(400)
        .json({ success: false, message: "Title, type and subject are required" });
    }

    if (title.length > 150) {
      return res
        .status(400)
        .json({ success: false, message: "Title must be 150 characters or less" });
    }

    if (!MATERIAL_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Type must be one of: ${MATERIAL_TYPES.join(", ")}`,
      });
    }

    if (!mongoose.isValidObjectId(subject) || !(await Subject.exists({ _id: subject }))) {
      return res.status(400).json({ success: false, message: "Subject not found" });
    }

    const result = await uploadPdf(req.file.buffer);

    const material = await Material.create({
      title,
      description,
      type,
      subject,
      examYear: examYear ? Number(examYear) : undefined,
      fileUrl: result.secure_url,
      uploadedBy: req.user._id,
      status: "pending", // waits for an admin to approve it
    });

    return res.status(201).json({
      success: true,
      message: "Uploaded. An admin will review it soon.",
      data: { material },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((e) => e.message)
        .join(", ");
      return res.status(400).json({ success: false, message });
    }
    return serverError(res, "Upload material error", error);
  }
};

// GET /api/materials/mine (the logged-in student's own uploads, with their status)
export const getMyMaterials = async (req, res) => {
  try {
    const materials = await Material.find({ uploadedBy: req.user._id })
      .populate("subject", "name code")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: { materials } });
  } catch (error) {
    return serverError(res, "Get my materials error", error);
  }
};

// GET /api/materials/pending (admin: the review queue, oldest first)
export const getPendingMaterials = async (req, res) => {
  try {
    const materials = await Material.find({ status: "pending" })
      .populate("subject", "name code year semester")
      .populate("uploadedBy", "name email")
      .sort({ createdAt: 1 });

    return res.status(200).json({ success: true, data: { materials } });
  } catch (error) {
    return serverError(res, "Get pending materials error", error);
  }
};

// PUT /api/materials/:id/approve (admin)
export const approveMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid material id" });
    }

    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({ success: false, message: "Material not found" });
    }

    if (material.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `This material is already ${material.status}`,
      });
    }

    material.status = "approved";
    material.rejectionReason = "";
    material.reviewedBy = req.user._id;
    material.reviewedAt = new Date();
    await material.save();

    return res
      .status(200)
      .json({ success: true, message: "Material approved", data: { material } });
  } catch (error) {
    return serverError(res, "Approve material error", error);
  }
};

// PUT /api/materials/:id/reject (admin, a reason is required)
export const rejectMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const reason = (req.body.reason || "").trim();

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid material id" });
    }

    if (!reason) {
      return res
        .status(400)
        .json({ success: false, message: "Please give a reason for rejecting" });
    }

    if (reason.length > 300) {
      return res
        .status(400)
        .json({ success: false, message: "Reason must be 300 characters or less" });
    }

    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({ success: false, message: "Material not found" });
    }

    if (material.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `This material is already ${material.status}`,
      });
    }

    material.status = "rejected";
    material.rejectionReason = reason;
    material.reviewedBy = req.user._id;
    material.reviewedAt = new Date();
    await material.save();

    return res
      .status(200)
      .json({ success: true, message: "Material rejected", data: { material } });
  } catch (error) {
    return serverError(res, "Reject material error", error);
  }
};