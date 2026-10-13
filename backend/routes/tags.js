const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  getTags,
  createTag,
  updateTag,
  deleteTag,
} = require("../controllers/tagController");

const router = express.Router();

router.get("/", getTags);
router.post("/", authMiddleware, createTag);
router.put("/:id", authMiddleware, updateTag);
router.delete("/:id", authMiddleware, deleteTag);

module.exports = router;
