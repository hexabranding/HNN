const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  getSettings,
  getAllSettings,
  updateSetting,
  seedSettings,
} = require("../controllers/settingController");

const router = express.Router();

router.get("/", getSettings);
router.get("/all", getAllSettings);
router.put("/:key", authMiddleware, updateSetting);
router.post("/seed", authMiddleware, seedSettings);

module.exports = router;
