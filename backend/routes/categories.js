const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  migrateCategories,
} = require("../controllers/categoryController");

const router = express.Router();

router.get("/", getCategories);
router.post("/", authMiddleware, createCategory);
router.put("/:slug", authMiddleware, updateCategory);
router.delete("/:slug", authMiddleware, deleteCategory);
router.post("/migrate", authMiddleware, migrateCategories);

module.exports = router;