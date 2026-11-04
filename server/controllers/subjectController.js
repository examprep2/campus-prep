import mongoose from "mongoose";
import Branch from "../models/Branch.js";
import Subject from "../models/Subject.js";

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
      message: "This subject code already exists for this scheme",
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

// Check that every id is valid and belongs to a real branch
const validBranchIds = async (branches) => {
  if (!Array.isArray(branches) || branches.length === 0) return false;
  if (!branches.every((id) => mongoose.isValidObjectId(id))) return false;
  const unique = [...new Set(branches.map(String))];
  const count = await Branch.countDocuments({ _id: { $in: unique } });
  return count === unique.length;
};

// GET /api/subjects?branch=ID&year=2&semester=3 (logged-in users)
export const getSubjects = async (req, res) => {
  try {
    const { branch, year, semester, includeInactive } = req.query;
    const filter = { isActive: true };

    if (branch) {
      if (!mongoose.isValidObjectId(branch)) {
        return res.status(400).json({ success: false, message: "Invalid branch id" });
      }
      filter.branches = branch;
    }
    if (year) filter.year = Number(year);
    if (semester) filter.semester = Number(semester);

    // Only admins may see hidden subjects
    if (req.user.role === "admin" && includeInactive === "true") {
      delete filter.isActive;
    }

    const subjects = await Subject.find(filter)
      .populate("branches", "name code")
      .sort({ year: 1, semester: 1, name: 1 });

    return res.status(200).json({ success: true, data: { subjects } });
  } catch (error) {
    return serverError(res, "Get subjects error", error);
  }
};

// POST /api/subjects (admin)
export const createSubject = async (req, res) => {
  try {
    const { name, code, year, semester, branches, scheme } = req.body;

    if (!name || !code || !year || !semester) {
      return res.status(400).json({
        success: false,
        message: "Name, code, year and semester are required",
      });
    }

    if (!(await validBranchIds(branches))) {
      return res
        .status(400)
        .json({ success: false, message: "Choose at least one valid branch" });
    }

    const subject = await Subject.create({
      name,
      code,
      year,
      semester,
      branches,
      scheme,
    });

    return res
      .status(201)
      .json({ success: true, message: "Subject created", data: { subject } });
  } catch (error) {
    return handleSaveError(res, "Create subject error", error);
  }
};

// PUT /api/subjects/:id (admin)
export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid subject id" });
    }

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    const { name, code, year, semester, branches, scheme, isActive } = req.body;

    if (branches !== undefined) {
      if (!(await validBranchIds(branches))) {
        return res
          .status(400)
          .json({ success: false, message: "Choose at least one valid branch" });
      }
      subject.branches = branches;
    }

    if (name !== undefined) subject.name = name;
    if (code !== undefined) subject.code = code;
    if (year !== undefined) subject.year = year;
    if (semester !== undefined) subject.semester = semester;
    if (scheme !== undefined) subject.scheme = scheme;
    if (isActive !== undefined) subject.isActive = isActive;

    await subject.save();
    return res
      .status(200)
      .json({ success: true, message: "Subject updated", data: { subject } });
  } catch (error) {
    return handleSaveError(res, "Update subject error", error);
  }
};