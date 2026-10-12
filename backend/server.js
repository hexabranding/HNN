const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

require("dotenv").config();
const fs = require("fs");
const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const newsRoutes = require("./routes/news");
const categoriesRoutes = require("./routes/categories");
const tagsRoutes = require("./routes/tags");
const pagesRoutes = require("./routes/pages");
const authorsRoutes = require("./routes/authors");
const settingsRoutes = require("./routes/settings");
const adsRoutes = require("./routes/ads");
const uploadRoutes = require("./routes/upload");
const Ad = require("./models/Ad");
const Image = require("./models/Image");
const { startWarmup } = require("./utils/warmTranslations");

const app = express();
const PORT = process.env.PORT || 4000;

const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }
   const allowed = [
  FRONTEND_URL,
  process.env.ALLOWED_ORIGIN,
  "http://localhost:4000",
  "http://127.0.0.1:4000",
].filter(Boolean);
    callback(null, allowed.includes(origin));
  },
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve uploaded images from MongoDB if the file is not on disk.
app.get("/uploads/:filename", async (req, res) => {
  try {
    const img = await Image.findOne({ filename: req.params.filename });
    if (!img || !img.data) return res.status(404).json({ error: "Image not found" });
    res.set("Content-Type", img.contentType || "application/octet-stream");
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    return res.send(img.data);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/pages", pagesRoutes);
app.use("/api/authors", authorsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/health", async (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStates = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.json({
    status: "ok",
    service: "HEXA NEWS API",
    db: dbStates[dbState] || "unknown",
  });
});

// --- Static site (project root) ---
const ROOT = path.join(__dirname, "..");
const BLOCKED_PREFIXES = ["/backend", "/node_modules", "/.git", "/.agents", "/testing"];

app.use((req, res, next) => {
  const blocked = BLOCKED_PREFIXES.some(
    (p) => req.path === p || req.path.startsWith(p + "/")
  );
  if (blocked) return res.status(404).send("Not found");
  next();
});

app.use(
  express.static(ROOT, {
    extensions: ["html"],
    dotfiles: "deny",
    index: "index.html",
  })
);

// Extensionless paths: /sports -> sports.html (if that file exists).
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) return next();
  if (path.extname(req.path)) return next();
  const candidate = path.join(ROOT, req.path + ".html");
  if (candidate.startsWith(ROOT) && fs.existsSync(candidate)) {
    return res.sendFile(candidate);
  }
  next();
});

// 404
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.status(404).sendFile(path.join(ROOT, "404.html"));
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

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
      console.log("Initial admin user created");
    } else if (!userExists) {
      console.warn("No admin user exists. Set ADMIN_INITIAL_PASSWORD to create the initial admin.");
    }
  } catch (e) {
    console.log("Auto-seed skipped:", e.message);
  }
}

// Start accepting requests immediately. MongoDB reconnects in the background,
// which is required by Hostinger's startup health check.
app.listen(PORT, () => {
  console.log(`\n HEXA NEWS (HNN) Backend running on port ${PORT}`);
  console.log(`   Health: /api/health\n`);
});

connectDB().then(async (connection) => {
  if (connection) {
    seedInitialAdmin();
    try {
      const indexes = await Ad.collection.listIndexes().toArray();
      const hasSlotIndex = indexes.some((idx) => idx.key && idx.key.slot === 1);
      if (hasSlotIndex) {
        await Ad.collection.dropIndex("slot_1");
        console.log("Dropped old unique index on Ad.slot");
      }
    } catch (err) {
      console.log("Index cleanup skipped:", err.message);
    }
    startWarmup();
  }
});
