import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Book from "../models/Book.js";
import Rental from "../models/Rental.js";
import Exchange from "../models/Exchange.js";

// ✅ Admin login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(400).json({ error: "Admin not found" });
    if (password !== admin.password)
      return res.status(400).json({ error: "Invalid password" });

    res.json({
      message: "Admin login successful",
      email: admin.email,
      role: "admin",
      upi: admin.upi || null,
    });
  } catch (err) {
    console.error("loginAdmin error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Fetch all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ✅ Fetch all books
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (err) {
    console.error("getAllBooks error:", err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

// ✅ Add a rental book
export const addRentalBook = async (req, res) => {
  try {
    const { title, author, price, rentalDuration, ownerEmail, quality } = req.body;

    if (!title || !author || !price || !rentalDuration || !ownerEmail || !quality)
      return res.status(400).json({ error: "All fields are required" });

    if (price < 100)
      return res.status(400).json({ error: "Price must be at least ₹100" });

    const newBook = new Book({
      title,
      author,
      price,
      mode: "rental",
      rentalDuration,
      ownerEmail,
      quality,
      isAvailable: true,
    });

    const savedBook = await newBook.save();
    res.status(201).json({ message: "Rental book added successfully", book: savedBook });
  } catch (err) {
    console.error("addRentalBook error:", err);
    res.status(500).json({ error: "Failed to add rental book" });
  }
};

// ✅ Fetch admin details by email
export const getAdminByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json({
      name: admin.name,
      email: admin.email,
      upi: admin.upi || null,
      role: "admin",
    });
  } catch (err) {
    console.error("getAdminByEmail error:", err);
    res.status(500).json({ message: "Failed to fetch admin", error: err.message });
  }
};

// ✅ Fetch all completed transactions (Rentals + Exchanges)
export const getAllTransactions = async (req, res) => {
  try {
    // Fetch all rental transactions (no status filter to ensure rentals show)
    const rentals = await Rental.find({});

    // Fetch only completed exchanges
    const exchanges = await Exchange.find({ status: "Completed" });

    res.json({ rentals, exchanges });
  } catch (error) {
    console.error("getAllTransactions error:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};
