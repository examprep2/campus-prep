import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Only lets logged-in users through
export const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Please log in to continue" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Account not found. Please log in again." });
    }

    if (user.isBlocked) {
      return res
        .status(403)
        .json({ success: false, message: "Your account has been blocked" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Session expired. Please log in again." });
  }
};

// Only lets admins through (always use it after protect)
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Admin access only" });
  }
  next();
};