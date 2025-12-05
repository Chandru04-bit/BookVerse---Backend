// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ===================================
// CORS for Localhost Frontend
// ===================================
const FRONTEND_URL = "http://localhost:5173"; // Change this if your frontend runs on another port

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", FRONTEND_URL);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Preflight request success
  }
  next();
});

// Parse JSON body
app.use(express.json());

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===================================
// MongoDB Connection
// ===================================
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bookverse";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ===================================
// Health Check Route
// ===================================
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

// ===================================
// API Routes
// ===================================
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

// Temporary mock orders route
app.get("/api/orders", (req, res) => {
  res.json({
    orders: [
      { _id: "1", user: "John Doe", total: 499, status: "Delivered", date: "2025-11-07" },
      { _id: "2", user: "Jane Smith", total: 799, status: "Pending", date: "2025-11-06" },
      { _id: "3", user: "Mark Wilson", total: 299, status: "Processing", date: "2025-11-05" },
    ],
  });
});

// ===================================
// Default Route
// ===================================
app.get("/", (req, res) => {
  res.send("📚 Bookstore API is running successfully...");
});

// ===================================
// Start Server Locally
// ===================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ===================================
// Export for Vercel (Optional)
// ===================================
export default app;
