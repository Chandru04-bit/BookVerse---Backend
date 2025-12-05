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
const FRONTEND = "https://book-verse-frontend-gkus.vercel.app";

app.use(
  cors({
    origin: FRONTEND,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", FRONTEND);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  return res.status(200).end();
});

// ----------------------
// ❗ REMOVE STATIC UPLOADS (NOT SUPPORTED ON VERCEL)
// ----------------------
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
