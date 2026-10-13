const Tag = require("../models/Tag");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Get all tags sorted by count
 * @route   GET /api/tags
 * @access  Public
 */
const getTags = asyncHandler(async (_req, res) => {
  const tags = await Tag.find().sort({ count: -1 });
  res.json(tags);
});

/**
 * @desc    Create a new tag
 * @route   POST /api/tags
 * @access  Private (Admin)
 */
const createTag = asyncHandler(async (req, res) => {
  const { name, slug } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ error: "name and slug are required" });
  }

  const existing = await Tag.findOne({
    $or: [{ name: name.trim() }, { slug: slug.trim() }],
  });
  if (existing) {
    return res.status(409).json({ error: "Tag already exists" });
  }

  const tag = await Tag.create({ name: name.trim(), slug: slug.trim() });
  res.status(201).json(tag);
});

/**
 * @desc    Update tag
 * @route   PUT /api/tags/:id
 * @access  Private (Admin)
 */
const updateTag = asyncHandler(async (req, res) => {
  const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!tag) {
    return res.status(404).json({ error: "Tag not found" });
  }
  res.json(tag);
});

/**
 * @desc    Delete tag
 * @route   DELETE /api/tags/:id
 * @access  Private (Admin)
 */
const deleteTag = asyncHandler(async (req, res) => {
  const tag = await Tag.findByIdAndDelete(req.params.id);
  if (!tag) {
    return res.status(404).json({ error: "Tag not found" });
  }
  res.json({ message: "Tag deleted" });
});

module.exports = {
  getTags,
  createTag,
  updateTag,
  deleteTag,
};
