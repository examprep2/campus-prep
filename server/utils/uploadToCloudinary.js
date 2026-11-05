import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";

// Sends a PDF (as bytes in memory) to Cloudinary and returns the result with its link
const uploadPdf = (buffer) =>
  new Promise((resolve, reject) => {
    // Read the keys here, when needed, so .env is always loaded by now
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw", // PDFs are stored as plain files
        folder: "campus-prep/materials",
        public_id: `${crypto.randomUUID()}.pdf`, // random name, so files never clash
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );

    stream.end(buffer);
  });

export default uploadPdf;