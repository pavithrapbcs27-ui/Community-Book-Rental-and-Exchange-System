import Book from "../models/Book.js";

// ➤ Add a book (updated)
export const addBook = async (req, res) => {
  try {
    // req.body contains text fields like title, author, etc.
    const { title, author, price, mode, rentalDuration, ownerEmail, quality } = req.body;
    
    // req.file is populated by the multer middleware (if configured correctly)
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; 

    // Validate required fields (including the newly required imageUrl)
    if (!title || !author || !mode || !ownerEmail || !quality || !imageUrl) {
      return res.status(400).json({ error: "All required fields must be filled, including an image" });
    }

    // Validate rental-specific rules (your original logic)
    if (mode === "rental") {
      if (!price || price < 100) {
        return res.status(400).json({ error: "Rental price must be at least 100" });
      }
      if (!rentalDuration) {
        return res.status(400).json({ error: "Rental duration is required" });
      }
    }

    const book = new Book({
      title,
      author,
      price: mode === "rental" ? price : null,
      mode,
      rentalDuration: mode === "rental" ? rentalDuration : null,
      quality,
      ownerEmail,
      imageUrl, // Save the path to the database
    });

    await book.save();
    res.status(201).json({ message: "Book added successfully!", book });
  } catch (err) {
    console.error("Failed to add book:", err);
    res.status(500).json({ error: "Failed to add book" });
  }
};


// ➤ Get all available books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error("Failed to fetch books:", err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

// ➤ Search books by title or author
export const searchBooks = async (req, res) => {
  try {
    const q = req.query.q || "";
    const books = await Book.find({
      isAvailable: true,
      $or: [
        { title: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } },
      ],
    });
    res.json(books);
  } catch (err) {
    console.error("Search failed:", err);
    res.status(500).json({ error: "Search failed" });
  }
};

// ➤ Update book availability
export const updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { isAvailable },
      { new: true }
    );
    res.json(book);
  } catch (err) {
    console.error("Failed to update availability:", err);
    res.status(500).json({ error: "Failed to update availability" });
  }
};

// Get all books for a specific user (exchange mode only)
export const getUserBooks = async (req, res) => {
  try {
    const email = (req.params.email || "").trim();
    // Case-insensitive match
    const books = await Book.find({
      ownerEmail: { $regex: `^${email}$`, $options: "i" },
      mode: "exchange",         // Only exchange books
      isAvailable: true
    });
    res.json(books);
  } catch (err) {
    console.error("Failed to fetch user's books:", err);
    res.status(500).json({ error: "Failed to fetch user's books" });
  }
};
