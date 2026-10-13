const Category = require("../models/Category");
const Article = require("../models/Article");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Get all categories structured as group -> children hierarchy with article counts
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ slug: 1 }).lean();

  const withCounts = await Promise.all(
    categories.map(async (cat) => ({
      ...cat,
      count: await Article.countDocuments({
        category: cat.slug,
        published: true,
      }),
    }))
  );

  const groups = withCounts.filter((c) => !c.parent);
  const children = withCounts.filter((c) => c.parent);

  const hierarchical = groups.map((group) => ({
    ...group,
    children: children
      .filter((child) => child.parent === group.slug)
      .sort((a, b) => a.slug.localeCompare(b.slug)),
  }));

  res.json(hierarchical);
});

/**
 * @desc    Create a category or subcategory
 * @route   POST /api/categories
 * @access  Private (Admin)
 */
const createCategory = asyncHandler(async (req, res) => {
  const { label, slug, titleMl, parent } = req.body;

  if (!label || !label.trim()) {
    return res.status(400).json({ error: "label is required" });
  }

  if (!slug || !slug.trim()) {
    return res.status(400).json({ error: "slug is required" });
  }

  const cleanLabel = label.trim();
  const cleanSlug = slug.trim();

  const existing = await Category.findOne({ slug: cleanSlug });
  if (existing) {
    return res.status(409).json({ error: "Category already exists" });
  }

  if (parent) {
    const parentCategory = await Category.findOne({ slug: parent });
    if (!parentCategory) {
      return res.status(400).json({ error: "Parent category not found" });
    }
  }

  const category = await Category.create({
    label: cleanLabel,
    slug: cleanSlug,
    titleMl: titleMl ? titleMl.trim() : "",
    parent: parent || null,
  });

  res.status(201).json(category);
});

/**
 * @desc    Update category and cascade slug changes to children & articles
 * @route   PUT /api/categories/:slug
 * @access  Private (Admin)
 */
const updateCategory = asyncHandler(async (req, res) => {
  const oldSlug = req.params.slug;
  const { label, titleMl, slug: requestedSlug } = req.body;

  if (!label || !label.trim()) {
    return res.status(400).json({ error: "label is required" });
  }

  const category = await Category.findOne({ slug: oldSlug });
  if (!category) {
    return res.status(404).json({ error: "Category not found" });
  }

  const newSlug = requestedSlug && requestedSlug.trim() ? requestedSlug.trim() : oldSlug;

  if (newSlug !== oldSlug) {
    const duplicate = await Category.findOne({
      slug: newSlug,
      _id: { $ne: category._id },
    });
    if (duplicate) {
      return res.status(409).json({ error: "A category with this slug already exists" });
    }
  }

  const wasGroup = !category.parent;

  category.label = label.trim();
  category.titleMl = titleMl ? titleMl.trim() : "";
  if (newSlug !== oldSlug) {
    category.slug = newSlug;
  }

  await category.save();

  // If a GROUP slug changed, update all child categories' parent field
  if (wasGroup && newSlug !== oldSlug) {
    await Category.updateMany({ parent: oldSlug }, { $set: { parent: newSlug } });
  }

  // If category slug changed, update article references
  if (newSlug !== oldSlug) {
    await Article.updateMany({ category: oldSlug }, { $set: { category: newSlug } });
    await Article.updateMany(
      { categories: oldSlug },
      { $set: { "categories.$[category]": newSlug } },
      { arrayFilters: [{ category: oldSlug }] }
    );
  }

  const updated = await Category.findOne({ slug: newSlug }).lean();
  res.json(updated);
});

/**
 * @desc    Delete category and cascade to children if group
 * @route   DELETE /api/categories/:slug
 * @access  Private (Admin)
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const slug = req.params.slug;

  const category = await Category.findOne({ slug });
  if (!category) {
    return res.status(404).json({ error: "Category not found" });
  }

  const isGroup = !category.parent;

  await Category.deleteOne({ _id: category._id });

  if (isGroup) {
    await Category.deleteMany({ parent: slug });
  }

  res.json({ message: "Category deleted successfully" });
});

/**
 * @desc    Migrate category schema (remove old obsolete id fields)
 * @route   POST /api/categories/migrate
 * @access  Private (Admin)
 */
const migrateCategories = asyncHandler(async (_req, res) => {
  const result = await Category.updateMany({}, { $unset: { id: "" } });
  res.json({
    message: "Category migration complete",
    modified: result.modifiedCount,
  });
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  migrateCategories,
};
