// index.js
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import fs from "fs";
import { createServer } from "http";
import cron from "node-cron";
import path from "path";

import { connectDB } from "./lib/db.js";
import { initializeSocket } from "./lib/socket.js";

// Import routes
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";

dotenv.config();
const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 5001;
const httpServer = createServer(app);
initializeSocket(httpServer);

// CORS configuration (adjust origin as needed)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// File upload middleware (for profile images, etc.)
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
  })
);

// ─── Cron Job TO CLEAN TEMPORARY FILES ─────────────────────────────
const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) {
        console.log("error", err);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(tempDir, file), (err) => {});
      }
    });
  }
});

// ─── ROUTES ─────────────────────────────────────────────────────────
// First, register auth endpoints so they bypass Clerk middleware.
// These endpoints support email/password signup/login and Google auth.
app.use("/api/auth", authRoutes);

// Now, apply Clerk middleware for routes that require it.
app.use(clerkMiddleware());

// Protected routes (for web users using Clerk, etc.)
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Serve static files in production mode.
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}

// ─── ERROR HANDLER ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// ─── START SERVER AND CONNECT TO DB ─────────────────────────────────
httpServer.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
  connectDB();
});
