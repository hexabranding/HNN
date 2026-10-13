const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { uploadImage } = require("../controllers/uploadController");

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), uploadImage);
router.post("/image", authMiddleware, upload.single("image"), uploadImage);

module.exports = router;