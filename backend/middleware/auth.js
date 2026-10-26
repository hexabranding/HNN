require("dotenv").config();
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV !== "production"
    ? "hexa_news_secret_2026_change_in_prod"
    : null);

/**
 * Generate a professional, signed JWT token
 * @param {Object} entity User or Author document
 * @returns {string} JWT Token valid for 30 days
 */
function createToken(entity) {
  if (!JWT_SECRET) {
    throw new Error("Cannot create token: JWT_SECRET is not configured.");
  }

  const isAuthor = Boolean(
    entity.isAuthor ||
    entity.authorId ||
    (entity._id && !entity.passwordHash && entity.role !== "admin" && entity.role !== "editor")
  );

  const payload = {
    id: String(entity._id || entity.id),
    sub: String(entity._id || entity.id),
    username: entity.username || entity.email || entity.name,
    email: entity.email || "",
    name: entity.name || entity.username || "User",
    role: entity.role || (isAuthor ? "Staff Reporter" : "admin"),
    isAuthor,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "30d", // 30 days CMS session duration
    issuer: "hexa-news",
  });
}

/**
 * Professional Express authentication middleware
 */
function authMiddleware(req, res, next) {
  if (!JWT_SECRET) {
    return res.status(503).json({
      error: "Authentication service is not configured. Missing JWT_SECRET.",
    });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized: No authentication token provided",
      code: "NO_TOKEN",
    });
  }

  const token = authHeader.substring(7).trim();
  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({
      error: "Unauthorized: Invalid token format",
      code: "INVALID_TOKEN_FORMAT",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Unauthorized: Session expired. Please sign in again.",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      error: "Unauthorized: Invalid or expired token",
      code: "INVALID_TOKEN",
    });
  }
}

/**
 * Administrator role authorization guard
 */
function adminOnly(req, res, next) {
  if (req.user?.isAuthor || (req.user?.role !== "admin" && req.user?.role !== "editor")) {
    return res.status(403).json({
      error: "Access denied. Administrator privileges required.",
      code: "FORBIDDEN",
    });
  }
  next();
}

module.exports = {
  authMiddleware,
  adminOnly,
  JWT_SECRET,
  createToken,
};
