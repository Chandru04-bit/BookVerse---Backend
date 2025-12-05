// ✅ controllers/bookController.js
import Book from "../models/Book.js";

// 📘 Get all books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    // ✅ Ensure correct image URL for every book
    const updatedBooks = books.map((book) => {
      let imagePath = book.image;

      if (!imagePath) return { ...book._doc, image: null };

      // Case 1: External image URL (starts with http)
      if (imagePath.startsWith("http")) {
        return { ...book._doc, image: imagePath };
      }

      // Case 2: Already includes uploads/
      if (imagePath.includes("uploads/")) {
        return {
          ...book._doc,
          image: `${req.protocol}://${req.get("host")}/${imagePath}`,
        };
      }

      // Case 3: Filename only — prepend uploads/
      return {
        ...book._doc,
        image: `${req.protocol}://${req.get("host")}/uploads/${imagePath}`,
      };
    });

    res.status(200).json({ success: true, books: updatedBooks });
  } catch (error) {
    console.error("❌ Error fetching books:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch books",
      error: error.message,
    });
  }
};

// 📗 Get single book by ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book)
      return res.status(404).json({ success: false, message: "Book not found" });

    let imageUrl = book.image;

    if (!imageUrl) {
      imageUrl = null;
    } else if (imageUrl.startsWith("http")) {
      // External link → use as-is
      imageUrl = imageUrl;
    } else if (imageUrl.includes("uploads/")) {
      // Already correct
      imageUrl = `${req.protocol}://${req.get("host")}/${imageUrl}`;
    } else {
      // Local filename → prepend uploads/
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${imageUrl}`;
    }

    res.status(200).json({
      success: true,
      book: { ...book._doc, image: imageUrl },
    });
  } catch (error) {
    console.error("❌ Error fetching book:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch book",
      error: error.message,
    });
  }
};

// ➕ Add new book
export const addBookController = async (req, res) => {
  try {
    const { title, author, description, price, category, stock } = req.body;

    // ✅ Save local uploads as "uploads/filename"
    let image = null;
    if (req.file) {
      image = `uploads/${req.file.filename}`;
    }

    const newBook = new Book({
      title,
      author,
      description,
      price,
      category,
      stock,
      image,
    });

    await newBook.save();

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      book: newBook,
    });
  } catch (error) {
    console.error("❌ Error adding book:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add book",
      error: error.message,
    });
  }
};

// ✏️ Update existing book
export const updateBookController = async (req, res) => {
  try {
    const { title, author, description, price, category, stock } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book)
      return res.status(404).json({ success: false, message: "Book not found" });

    // ✅ Update fields safely
    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.price = price || book.price;
    book.category = category || book.category;
    book.stock = stock || book.stock;

    // ✅ Update image if new one uploaded
    if (req.file) {
      book.image = `uploads/${req.file.filename}`;
    }

    await book.save();

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    console.error("❌ Error updating book:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update book",
      error: error.message,
    });
  }
};

// ❌ Delete a book
export const deleteBookController = async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Book not found" });

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting book:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete book",
      error: error.message,
    });
  }
};
