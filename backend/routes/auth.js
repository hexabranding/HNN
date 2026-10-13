const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const { login, getMe, logout } = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logout);

module.exports = router;
