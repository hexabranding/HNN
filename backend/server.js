const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

require("dotenv").config();
const fs = require("fs");
const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

// Middlewares
const requestLogger = require("./middleware/logger");
const { notFound, errorHandler } = require("./middleware/errorHandler");

// Controllers
const { serveImage } = require("./controllers/uploadController");

// Routes
const authRoutes = require("./routes/auth");
const newsRoutes = require("./routes/news");
const categoriesRoutes = require("./routes/categories");
const tagsRoutes = require("./routes/tags");
const pagesRoutes = require("./routes/pages");
const authorsRoutes = require("./routes/authors");
const settingsRoutes = require("./routes/settings");
const adsRoutes = require("./routes/ads");
const uploadRoutes = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL;

// --- 1. CORS & Security Middlewares ---
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      const rawOrigins = [
        FRONTEND_URL,
        process.env.ALLOWED_ORIGIN,
        "http://localhost:4000",
        "http://127.0.0.1:4000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
      ].filter(Boolean);
      const allowed = rawOrigins.flatMap((o) => o.split(",")).map((s) => s.trim());
      callback(null, allowed.includes(origin));
    },
    credentials: true,
  })
);

// --- 2. Body Parsers ---
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// --- 3. Request Logger ---
app.use(requestLogger);

// --- 4. Static Files & Image Storage ---
const uploadDir = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadDir, { maxAge: "7d", etag: true }));

// Fallback: Stream uploaded images from MongoDB if disk cache misses
app.get("/uploads/:filename", serveImage);

// Static images from frontend public directory
const FRONTEND_PUBLIC_IMAGES = path.join(__dirname, "../frontend/public/images");
app.use("/images", express.static(FRONTEND_PUBLIC_IMAGES, { maxAge: "7d", etag: true }));

// --- 5. Mount API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/pages", pagesRoutes);
app.use("/api/authors", authorsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/upload", uploadRoutes);

// --- 6. Health Check Endpoint ---
app.get("/api/health", async (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStates = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.json({
    status: "ok",
    service: "HEXA NEWS API",
    db: dbStates[dbState] || "unknown",
  });
});

// --- 7. Serve React Production Build (if dist exists) ---
const FRONTEND_DIST = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads") || req.path.startsWith("/images")) {
      return next();
    }
    res.sendFile(path.join(FRONTEND_DIST, "index.html"));
  });
}

// --- 8. Error Handling Middlewares ---
app.use(notFound);
app.use(errorHandler);

// --- 9. Bootstrap & Startup Utilities ---
async function seedInitialAdmin() {
  try {
    const bcrypt = require("bcryptjs");
    const User = require("./models/User");
    const userExists = await User.findOne({ username: "admin" });
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;
    if (!userExists && initialPassword) {
      const passwordHash = await bcrypt.hash(initialPassword, 10);
      await User.create({
        username: "admin",
        email: "admin@hexanews.in",
        passwordHash,
        role: "admin",
        name: "HEXA NEWS Admin",
      });
      console.log(" Initial admin user created");
    }
  } catch (e) {
    console.log(" Auto-seed skipped:", e.message);
  }
}

// Start HTTP server immediately (supports Hostinger & cloud health checkers)
const server = app.listen(PORT, () => {
  console.log(`\n🚀 HEXA NEWS (HNN) Enterprise Backend running on port ${PORT}`);
  console.log(`   Architecture: Layered MVC (Models, Views/API, Controllers)`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});

// Establish database connection asynchronously
connectDB().then((connection) => {
  if (connection) {
    seedInitialAdmin();
  }
});

// Process safeguards: prevent abrupt termination on unhandled errors
process.on("unhandledRejection", (reason) => {
  console.error("⚠️ Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
});

// Graceful shutdown on termination signals
function gracefulShutdown(signal) {
  console.log(`\n🛑 Received ${signal}. Gracefully shutting down HEXA NEWS server...`);
  server.close(async () => {
    try {
      await mongoose.connection.close(false);
      console.log("✅ Closed MongoDB connection.");
    } catch {}
    process.exit(0);
  });
  setTimeout(() => {
    console.error("⚠️ Forcefully shutting down server after timeout.");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
