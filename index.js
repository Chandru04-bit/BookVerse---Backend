// index.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

dotenv.config();

// ES Module dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ----------------------
// Middlewares
// ----------------------
app.use(express.json());
app.use(cookieParser());

// ----------------------
// CORS FIX FOR VERCEL
// ----------------------
const allowedOrigins = [
  'https://book-verse-frontend-ujls.vercel.app',
  'https://book-verse-frontend-gkus.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true, // allow cookies/auth headers
}));

// Preflight OPTIONS requests for all routes
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ----------------------
// Routes
// ----------------------
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

// ----------------------
// Home Route
// ----------------------
app.get("/", (req, res) => {
  res.json({ message: "📚 Backend is running LIVE on Vercel!" });
});

// ----------------------
// MongoDB Connect
// ----------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// ----------------------
// Export for Vercel (no listen())
// ----------------------
export default app;
