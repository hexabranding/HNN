const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  getNews,
  getNewsStats,
  getNewsBySlug,
  createNews,
  updateNews,
  incrementView,
  deleteNews,
  translateSingle,
  translateBatch,
  migrateSlugs,
} = require("../controllers/newsController");

const router = express.Router();

router.get("/stats", getNewsStats);
router.get("/", getNews);
router.get("/slug/:slug", getNewsBySlug);
router.get("/:slug", getNewsBySlug);

router.post("/translate", translateSingle);
router.post("/translate-batch", translateBatch);

router.post("/", authMiddleware, createNews);
router.put("/:id", authMiddleware, updateNews);
router.patch("/:id/view", incrementView);
router.delete("/:id", authMiddleware, deleteNews);
router.post("/migrate-slugs", authMiddleware, migrateSlugs);

module.exports = router;
