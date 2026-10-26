const express = require("express");
const { authMiddleware, adminOnly } = require("../middleware/auth");
const {
  getActiveAds,
  getAllAds,
  getAdSlots,
  getAdsBySlotsBatch,
  getAdByIdOrSlot,
  createAd,
  updateAd,
  deleteAd,
} = require("../controllers/adController");

const router = express.Router();

router.get("/", getActiveAds);
router.get("/all", authMiddleware, adminOnly, getAllAds);
router.get("/slots", getAdSlots);
router.get("/batch", getAdsBySlotsBatch);
router.get("/:id", getAdByIdOrSlot);

router.post("/", authMiddleware, adminOnly, createAd);
router.put("/:id", authMiddleware, adminOnly, updateAd);
router.delete("/:id", authMiddleware, adminOnly, deleteAd);

module.exports = router;
