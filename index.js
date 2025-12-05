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
app.use(cookieParser()); // For HTTP-only cookies

// ---------------------------
// CORS configuration
// ---------------------------
const allowedOrigins = [
  "https://book-verse-frontend-6xsv.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman/server requests
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true // allow cookies
}));

// ---------------------------
// Serve static uploads
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
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ---------------------------
// Export for Vercel serverless deployment
// ---------------------------
export default app;
