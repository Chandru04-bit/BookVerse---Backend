import mongoose from "mongoose";

// ✅ Book Schema
const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    image: { type: String, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError during dev hot reload
const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);

export default Book;


