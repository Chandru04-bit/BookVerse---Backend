// ✅ src/routes/bookRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import {
  getBooks,
  addBookController,
  updateBookController,
  deleteBookController,
} from "../controllers/bookController.js";
import Book from "../models/Book.js";

const router = express.Router();

// ✅ Serve uploaded images
router.use("/uploads", express.static("uploads"));

// ✅ Multer config for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

/* ===============================
   📚 ROUTES
=============================== */

// ✅ Get all books
router.get("/", getBooks);

// ✅ Get single book by ID safely
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let book = null;

    // Try as MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      book = await Book.findById(id);
    }

    // If numeric, try numeric `id` field
    if (!book && !isNaN(id)) {
      book = await Book.findOne({ id: Number(id) });
    }

    // Fallback: return first book in DB
    if (!book) {
      console.warn(`⚠️ Book not found for ID: ${id}, returning first book.`);
      book = await Book.findOne();
    }

    if (!book) {
      return res.status(404).json({ message: "No books found in database" });
    }

    res.json(book);
  } catch (error) {
    console.error("❌ Error fetching book:", error);
    res.status(500).json({ message: "Server error fetching book" });
  }
});

// ➕ Add new book with image upload
router.post("/", upload.single("image"), addBookController);

// ✏️ Update book by ID (with optional image)
router.put("/:id", upload.single("image"), updateBookController);

// ❌ Delete book by ID
router.delete("/:id", deleteBookController);

export default router;



