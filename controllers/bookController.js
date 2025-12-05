import Book from "../models/Book.js";

// ---------------------------
// Get all books
// GET /api/books
// ---------------------------
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, books });
  } catch (error) {
    console.error("GetBooks Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch books" });
  }
};

// ---------------------------
// Get single book by ID
// GET /api/books/:id
// ---------------------------
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    res.status(200).json({ success: true, book });
  } catch (error) {
    console.error("GetBookById Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch book" });
  }
};

// ---------------------------
// Add book
// POST /api/books
// ---------------------------
export const addBookController = async (req, res) => {
  try {
    const { title, author, description, price, category, stock } = req.body;
    if (!title || !price) {
      return res.status(400).json({ success: false, message: "Title and price are required" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newBook = new Book({ title, author, description, price, category, stock, image });
    await newBook.save();

    res.status(201).json({ success: true, message: "Book added successfully", book: newBook });
  } catch (error) {
    console.error("AddBook Error:", error);
    res.status(500).json({ success: false, message: "Failed to add book" });
  }
};

// ---------------------------
// Update book
// PUT /api/books/:id
// ---------------------------
export const updateBookController = async (req, res) => {
  try {
    const { title, author, description, price, category, stock } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.price = price || book.price;
    book.category = category || book.category;
    book.stock = stock || book.stock;

    if (req.file) book.image = `/uploads/${req.file.filename}`;

    await book.save();

    res.status(200).json({ success: true, message: "Book updated successfully", book });
  } catch (error) {
    console.error("UpdateBook Error:", error);
    res.status(500).json({ success: false, message: "Failed to update book" });
  }
};

// ---------------------------
// Delete book
// DELETE /api/books/:id
// ---------------------------
export const deleteBookController = async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Book not found" });

    res.status(200).json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    console.error("DeleteBook Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete book" });
  }
};
