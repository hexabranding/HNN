const path = require("path");
const fs = require("fs");
const Image = require("../models/Image");
const asyncHandler = require("../utils/asyncHandler");

const uploadDir = path.join(__dirname, "..", "uploads");
try {
  fs.mkdirSync(uploadDir, { recursive: true });
} catch {}

function generateFilename(file) {
  const ext = path.extname(file.originalname) || ".jpg";
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
}

/**
 * @desc    Upload image to memory buffer, local disk cache, and persistent MongoDB Image collection
 * @route   POST /api/upload/image
 * @access  Private (Admin / Editor)
 */
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const filename = generateFilename(req.file);

  // 1. Save to local disk cache (optional performance optimization)
  try {
    fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
  } catch (diskErr) {
    console.warn("Local disk image cache save failed:", diskErr.message);
  }

  // 2. Save persistently to MongoDB
  try {
    await Image.create({
      filename,
      contentType: req.file.mimetype,
      size: req.file.size,
      data: req.file.buffer,
      createdBy: req.user?.username || "",
    });
  } catch (mongoErr) {
    console.error("Mongo image save failed:", mongoErr);
    return res.status(500).json({
      error: "Image could not be saved to database",
      details: process.env.NODE_ENV === "production" ? undefined : mongoErr.message,
    });
  }

  return res.status(201).json({
    success: true,
    url: `/uploads/${filename}`,
  });
});

/**
 * @desc    Serve uploaded image from MongoDB if not on local disk
 * @route   GET /uploads/:filename
 * @access  Public
 */
const serveImage = asyncHandler(async (req, res) => {
  const img = await Image.findOne({ filename: req.params.filename });
  if (!img || !img.data) {
    return res.status(404).json({ error: "Image not found" });
  }

  res.set("Content-Type", img.contentType || "application/octet-stream");
  res.set("Cache-Control", "public, max-age=31536000, immutable");
  return res.send(img.data);
});

module.exports = {
  uploadImage,
  serveImage,
};
