const express = require("express");
const { authMiddleware, adminOnly } = require("../middleware/auth");
const {
  getTags,
  createTag,
  updateTag,
  deleteTag,
} = require("../controllers/tagController");

const router = express.Router();

router.get("/", getTags);
router.post("/", authMiddleware, adminOnly, createTag);
router.put("/:id", authMiddleware, adminOnly, updateTag);
router.delete("/:id", authMiddleware, adminOnly, deleteTag);

module.exports = router;
