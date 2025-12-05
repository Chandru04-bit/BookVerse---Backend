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

// Local file upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes
router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", upload.single("image"), addBookController);
router.put("/:id", upload.single("image"), updateBookController);
router.delete("/:id", deleteBookController);

export default router;
