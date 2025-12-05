import express from "express";
import multer from "multer";
import {
  getBooks,
  getBookById,
  addBookController,
  updateBookController,
  deleteBookController,
} from "../controllers/bookController.js";
import path from "path";

const router = express.Router();

// ---------------------------
// File upload setup
// ---------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ---------------------------
// CRUD Routes
// ---------------------------
router.get("/", getBooks); // Get all books
router.get("/:id", getBookById); // Get single book by ID
router.post("/", upload.single("image"), addBookController); // Add book
router.put("/:id", upload.single("image"), updateBookController); // Update book
router.delete("/:id", deleteBookController); // Delete book

export default router;
