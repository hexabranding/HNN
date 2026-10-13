const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  getPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
} = require("../controllers/pageController");

const router = express.Router();

router.get("/", getPages);
router.get("/:slug", getPageBySlug);
router.post("/", authMiddleware, createPage);
router.put("/:id", authMiddleware, updatePage);
router.delete("/:id", authMiddleware, deletePage);

module.exports = router;
