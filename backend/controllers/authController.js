const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
const Author = require("../models/Author");
const { JWT_SECRET, createToken } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Authenticate user or author & get professional 7-day token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  if (!JWT_SECRET) {
    return res.status(503).json({
      error: "Authentication service is not configured. Missing JWT_SECRET.",
    });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      error: "Username/email and password are required",
    });
  }

  const cleanLogin = String(username).trim();

  // 1. Check User collection (Admin / Editor)
  const user = await User.findOne({
    $or: [{ username: cleanLogin }, { email: cleanLogin.toLowerCase() }],
  });

  if (user) {
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials. Please verify your password." });
    }

    const token = createToken({
      ...user.toObject(),
      isAuthor: false,
    });

    return res.json({
      token,
      user: user.toPublic(),
    });
  }

  // 2. Check Author collection (Chief Editor, Staff Reporter, etc.)
  const author = await Author.findOne({
    $or: [
      { email: cleanLogin.toLowerCase() },
      { name: new RegExp(`^${cleanLogin}$`, "i") },
    ],
  });

  if (author) {
    if (!author.password) {
      return res.status(401).json({
        error: "This author account does not have a password configured yet. Please ask the Administrator to set your password in the Authors panel.",
      });
    }

    const validAuthor = await bcrypt.compare(password, author.password);
    if (validAuthor) {
      const token = createToken({
        ...author.toObject(),
        isAuthor: true,
      });

      return res.json({
        token,
        user: {
          id: author._id,
          username: author.email || author.name,
          name: author.name,
          role: author.role || "Staff Reporter",
          email: author.email,
          photo: author.photo,
          bio: author.bio,
          isAuthor: true,
        },
      });
    }
  }

  return res.status(401).json({
    error: "Invalid credentials. Please check your username/email and password.",
  });
});

/**
 * @desc    Get current user or author profile from token
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?.sub;

  // 1. Check User model
  let user = null;
  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    user = await User.findById(userId);
  }
  if (!user && req.user?.username) {
    user = await User.findOne({ username: req.user.username });
  }

  if (user) {
    return res.json({
      user: user.toPublic(),
    });
  }

  // 2. Check Author model
  let author = null;
  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    author = await Author.findById(userId);
  }
  if (!author && req.user?.name) {
    author = await Author.findOne({ name: req.user.name });
  }
  if (!author && req.user?.email) {
    author = await Author.findOne({ email: req.user.email.toLowerCase() });
  }

  if (author) {
    return res.json({
      user: {
        id: author._id,
        username: author.email || author.name,
        name: author.name,
        role: author.role || "Staff Reporter",
        email: author.email,
        photo: author.photo,
        bio: author.bio,
        isAuthor: true,
      },
    });
  }

  res.status(404).json({ error: "User or author profile not found" });
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
