// ✅ backend/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Routes
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js"; // CRUD operations for books

// ===============================
//  Environment & App Setup
// ===============================
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ===============================
//  Middleware
// ===============================
app.use(
  cors({
    origin: "http://localhost:5173", // React frontend (Vite default)
    credentials: true,
  })
);
app.use(express.json()); // Parse JSON request bodies

// ✅ Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================
//  MongoDB Connection
// ===============================
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bookstore";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ===============================
//  Health Check Route (Frontend Check)
// ===============================
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "✅ Server is running properly" });
});

// ===============================
//  API Routes
// ===============================
app.use("/api/users", userRoutes); // Authentication
app.use("/api/books", bookRoutes); // Books CRUD

// ✅ TEMP MOCK ORDERS ROUTE (to fix 404)
app.get("/api/orders", (req, res) => {
  res.json({
    orders: [
      {
        _id: "1",
        user: "John Doe",
        total: 499,
        status: "Delivered",
        date: "2025-11-07",
      },
      {
        _id: "2",
        user: "Jane Smith",
        total: 799,
        status: "Pending",
        date: "2025-11-06",
      },
      {
        _id: "3",
        user: "Mark Wilson",
        total: 299,
        status: "Processing",
        date: "2025-11-05",
      },
    ],
  });
});

// ===============================
//  Default Route (for testing)
// ===============================
app.get("/", (req, res) => {
  res.send("📚 Bookstore API is running successfully...");
});

// ===============================
//  Start Server
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🖼️ Static files: http://localhost:${PORT}/uploads/<filename>`);
});
