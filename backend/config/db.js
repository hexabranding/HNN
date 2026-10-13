const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected. Attempting reconnection...");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err.message);
});

async function connectDB() {
  if (!MONGO_URI) {
    console.error("❌ MONGO_URI environment variable is missing.");
    return null;
  }

  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`\n✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`❌ Initial MongoDB connection error: ${err.message}`);
    console.log("⏳ Retrying connection in 10s...");
    setTimeout(connectDB, 10000);
    return null;
  }
}

module.exports = connectDB;
