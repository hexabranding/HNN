const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Author = require("../models/Author");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Get all authors sorted by article count
 * @route   GET /api/authors
 * @access  Public
 */
const getAuthors = asyncHandler(async (_req, res) => {
  const authors = await Author.find()
    .select("-password")
    .sort({ count: -1, createdAt: -1 });
  res.json(authors);
});

/**
 * @desc    Create a new author (Admin only)
 * @route   POST /api/authors
 * @access  Private (Admin)
 */
const createAuthor = asyncHandler(async (req, res) => {
  if (req.user?.isAuthor) {
    return res.status(403).json({
      error: "Access denied. Only administrators can register new authors.",
    });
  }

  const { name, nameMl, role, roleMl, bio, photo, email, password } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Author name is required" });
  }

  const cleanName = name.trim();
  const existing = await Author.findOne({ name: cleanName });
  if (existing) {
    return res.status(409).json({ error: "Author already exists with this name" });
  }

  if (email && email.trim()) {
    const cleanEmail = email.trim().toLowerCase();
    const existingEmail = await Author.findOne({ email: cleanEmail });
    if (existingEmail) {
      return res.status(409).json({ error: "An author with this email address already exists" });
    }
  }

  let hashedPassword = "";
  if (password && password.trim()) {
    hashedPassword = await bcrypt.hash(password.trim(), 10);
  }

  const author = await Author.create({
    name: cleanName,
    nameMl: nameMl || "",
    role: role || "Staff Reporter",
    roleMl: roleMl || "",
    bio: bio || "",
    photo: photo || "",
    email: email ? email.trim().toLowerCase() : "",
    password: hashedPassword,
  });

  const responseAuthor = author.toObject();
  delete responseAuthor.password;
  res.status(201).json(responseAuthor);
});

/**
 * @desc    Update author (Admin can update any; Authors can update their own)
 * @route   PUT /api/authors/:id
 * @access  Private
 */
const updateAuthor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Role check: Authors may only update themselves
  if (req.user?.isAuthor) {
    const authorUserId = String(req.user.id || req.user.sub || "");
    if (authorUserId !== String(id) && req.user.name !== id && req.user.username !== id) {
      return res.status(403).json({
        error: "Access denied. Authors are only permitted to update their own profile.",
      });
    }
  }

  const updateData = { ...req.body };

  if (updateData.name) {
    updateData.name = updateData.name.trim();
  }
  if (updateData.email) {
    updateData.email = updateData.email.trim().toLowerCase();
  }

  if (updateData.password && updateData.password.trim()) {
    updateData.password = await bcrypt.hash(updateData.password.trim(), 10);
  } else {
    delete updateData.password; // Do not overwrite with blank
  }

  let author = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    author = await Author.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
  }
  if (!author) {
    author = await Author.findOneAndUpdate({ name: id }, updateData, { new: true }).select("-password");
  }

  if (!author) {
    return res.status(404).json({ error: "Author not found" });
  }

  res.json(author);
});

/**
 * @desc    Delete author (Admin only)
 * @route   DELETE /api/authors/:id
 * @access  Private (Admin)
 */
const deleteAuthor = asyncHandler(async (req, res) => {
  if (req.user?.isAuthor) {
    return res.status(403).json({
      error: "Access denied. Only administrators can delete author accounts.",
    });
  }

  const { id } = req.params;
  let author = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    author = await Author.findByIdAndDelete(id);
  }
  if (!author) {
    author = await Author.findOneAndDelete({ name: id });
  }

  if (!author) {
    return res.status(404).json({ error: "Author not found" });
  }

  res.json({ message: "Author deleted successfully", id: author._id });
});

module.exports = {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
