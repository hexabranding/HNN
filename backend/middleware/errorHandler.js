/**
 * Centralized Error Handling Middleware
 */

const notFound = (req, res, _next) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: `Not Found: ${req.method} ${req.originalUrl}` });
  }
  return res.status(404).json({ error: "Page not found" });
};

const errorHandler = (err, req, res, _next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  // MongoDB duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value entered for ${field}. Please choose another.`;
  }

  // Mongoose invalid ObjectId (CastError)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found with id of ${err.value}`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(", ");
  }

  // Multer errors
  if (err.name === "MulterError") {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File too large. Maximum size is 5 MB.";
    } else {
      message = err.message || "File upload error";
    }
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token authorization";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired, please log in again";
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);
  }

  return res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
};

module.exports = {
  notFound,
  errorHandler,
};
