const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  if (!JWT_SECRET) {
    return res.status(503).json({
      error: "Authentication is not configured. Missing JWT_SECRET.",
    });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      error: "Username and password are required",
    });
  }

  const user = await User.findOne({
    $or: [{ username }, { email: username.toLowerCase() }],
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    token,
    user: user.toPublic(),
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    user: user.toPublic(),
  });
});

/**
 * @desc    Logout user / invalidate token client-side
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (_req, res) => {
  res.json({ message: "Logged out successfully" });
});

module.exports = {
  login,
  getMe,
  logout,
};
