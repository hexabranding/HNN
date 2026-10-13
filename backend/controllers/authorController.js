const Author = require("../models/Author");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Get all authors sorted by article count
 * @route   GET /api/authors
 * @access  Public
 */
const getAuthors = asyncHandler(async (_req, res) => {
  const authors = await Author.find().sort({ count: -1 });
  res.json(authors);
});

/**
 * @desc    Create a new author
 * @route   POST /api/authors
 * @access  Private (Admin)
 */
const createAuthor = asyncHandler(async (req, res) => {
  const { name, nameMl, role, roleMl, bio, photo, email } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "name is required" });
  }

  const existing = await Author.findOne({ name: name.trim() });
  if (existing) {
    return res.status(409).json({ error: "Author already exists" });
  }

  const author = await Author.create({
    name: name.trim(),
    nameMl: nameMl || "",
    role: role || "Reporter",
    roleMl: roleMl || "",
    bio: bio || "",
    photo: photo || "",
    email: email || "",
  });

  res.status(201).json(author);
});

/**
 * @desc    Update author
 * @route   PUT /api/authors/:id
 * @access  Private (Admin)
 */
const updateAuthor = asyncHandler(async (req, res) => {
  const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!author) {
    return res.status(404).json({ error: "Author not found" });
  }
  res.json(author);
});

/**
 * @desc    Delete author
 * @route   DELETE /api/authors/:id
 * @access  Private (Admin)
 */
const deleteAuthor = asyncHandler(async (req, res) => {
  const author = await Author.findByIdAndDelete(req.params.id);
  if (!author) {
    return res.status(404).json({ error: "Author not found" });
  }
  res.json({ message: "Author deleted" });
});

module.exports = {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
