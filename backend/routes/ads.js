const express = require("express");
const { authMiddleware } = require("../middleware/auth");
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
router.get("/all", authMiddleware, getAllAds);
router.get("/slots", getAdSlots);
router.get("/batch", getAdsBySlotsBatch);
router.get("/:id", getAdByIdOrSlot);

router.post("/", authMiddleware, createAd);
router.put("/:id", authMiddleware, updateAd);
router.delete("/:id", authMiddleware, deleteAd);

module.exports = router;
