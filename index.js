// index.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

dotenv.config();

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ---------------------------
// Middleware
// ---------------------------
app.use(express.json());
app.use(cookieParser()); // for HTTP-only cookies

// ---------------------------
// CORS configuration
// ---------------------------
const allowedOrigins = [
  "https://book-verse-frontend-6xsv.vercel.app", // main frontend
  "https://book-verse-frontend-p164.vercel.app"  // optional old frontend
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman or server-to-server requests
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allow cookies
}));

// ---------------------------
// Static uploads folder
// ---------------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------------------
// API Routes
// ---------------------------
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

// ---------------------------
// Root route
// ---------------------------
app.get("/", (req, res) => {
  res.send("📚 Book Library API running...");
});

// ---------------------------
// MongoDB Connection
// ---------------------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ---------------------------
// Local development server
// ---------------------------
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// ---------------------------
// Export for Vercel serverless
// ---------------------------
export default app;
