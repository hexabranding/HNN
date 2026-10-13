const Page = require("../models/Page");
const asyncHandler = require("../utils/asyncHandler");

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

/**
 * @desc    Get all pages sorted by order
 * @route   GET /api/pages
 * @access  Public
 */
const getPages = asyncHandler(async (_req, res) => {
  const pages = await Page.find().sort({ order: 1 });
  res.json(pages);
});

/**
 * @desc    Get single page by slug
 * @route   GET /api/pages/:slug
 * @access  Public
 */
const getPageBySlug = asyncHandler(async (req, res) => {
  const page = await Page.findOne({ slug: req.params.slug });
  if (!page) {
    return res.status(404).json({ error: "Page not found" });
  }
  res.json(page);
});

/**
 * @desc    Create a new custom page
 * @route   POST /api/pages
 * @access  Private (Admin)
 */
const createPage = asyncHandler(async (req, res) => {
  const { title, titleMl, content, contentMl } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "title is required" });
  }

  const slug = slugify(title) + "-" + Date.now().toString(36);
  const page = await Page.create({
    slug,
    title: title.trim(),
    titleMl: titleMl || "",
    content: content || "",
    contentMl: contentMl || "",
  });

  res.status(201).json(page);
});

/**
 * @desc    Update page
 * @route   PUT /api/pages/:id
 * @access  Private (Admin)
 */
const updatePage = asyncHandler(async (req, res) => {
  const page = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!page) {
    return res.status(404).json({ error: "Page not found" });
  }
  res.json(page);
});

/**
 * @desc    Delete page
 * @route   DELETE /api/pages/:id
 * @access  Private (Admin)
 */
const deletePage = asyncHandler(async (req, res) => {
  const page = await Page.findByIdAndDelete(req.params.id);
  if (!page) {
    return res.status(404).json({ error: "Page not found" });
  }
  res.json({ message: "Page deleted" });
});

module.exports = {
  getPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
};
