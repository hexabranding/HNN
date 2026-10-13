const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorController");

const router = express.Router();

router.get("/", getAuthors);
router.post("/", authMiddleware, createAuthor);
router.put("/:id", authMiddleware, updateAuthor);
router.delete("/:id", authMiddleware, deleteAuthor);

module.exports = router;
