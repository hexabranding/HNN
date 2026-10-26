const express = require("express");
const { authMiddleware, adminOnly } = require("../middleware/auth");
const {
  getSettings,
  getAllSettings,
  updateSetting,
  seedSettings,
} = require("../controllers/settingController");

const router = express.Router();

router.get("/", getSettings);
router.get("/all", getAllSettings);
router.put("/:key", authMiddleware, adminOnly, updateSetting);
router.post("/seed", authMiddleware, adminOnly, seedSettings);

module.exports = router;
