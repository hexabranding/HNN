const express = require("express");
const { authMiddleware, adminOnly } = require("../middleware/auth");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  migrateCategories,
} = require("../controllers/categoryController");

const router = express.Router();

router.get("/", getCategories);
router.post("/", authMiddleware, adminOnly, createCategory);
router.put("/:slug", authMiddleware, adminOnly, updateCategory);
router.delete("/:slug", authMiddleware, adminOnly, deleteCategory);
router.post("/migrate", authMiddleware, adminOnly, migrateCategories);

module.exports = router;