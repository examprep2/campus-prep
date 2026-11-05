import multer from "multer";

const MAX_FILE_SIZE_MB = 10;

const upload = multer({
  storage: multer.memoryStorage(), // keep the file in memory, then send it to Cloudinary
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("ONLY_PDF"));
    }
    cb(null, true);
  },
});

// Use this on a route. The file must be sent in a field called "file"
export const uploadPdfFile = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (!err) return next();

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: `File is too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`,
      });
    }
    if (err.message === "ONLY_PDF") {
      return res
        .status(400)
        .json({ success: false, message: "Only PDF files are allowed" });
    }
    return res
      .status(400)
      .json({ success: false, message: "Upload failed. Please try again." });
  });
};