import Book from "../models/Book.js";

// Get all books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch books" });
  }
};

// Get single book by ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    res.status(200).json({ success: true, book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch book" });
  }
};

// Add book
export const addBookController = async (req, res) => {
  try {
    const { title, author, description, price, category, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newBook = new Book({ title, author, description, price, category, stock, image });
    await newBook.save();

    res.status(201).json({ success: true, message: "Book added successfully", book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add book" });
  }
};

// Update book
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
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update book" });
  }
};

// Delete book
export const deleteBookController = async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Book not found" });
    res.status(200).json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete book" });
  }
};
