import Rental from "../models/Rental.js";
import Book from "../models/Book.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

// ✅ Create rental transaction
export const createRental = async (req, res) => {
  try {
    const {
      bookId,
      bookTitle,
      bookAuthor,
      bookPrice,
      bookQuality,
      rentalDuration,
      startDate,
      endDate,
      renterEmail,
      upi
    } = req.body;

    if (!bookId || !renterEmail || !upi || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // ✅ Fetch owner (can be Admin or User)
    let owner = await User.findOne({ email: book.ownerEmail });
    if (!owner) {
      owner = await Admin.findOne({ email: book.ownerEmail });
    }
    if (!owner) {
      return res.status(404).json({ message: "Owner not found in database" });
    }

    // ✅ Fetch renter (must be a user)
    const renter = await User.findOne({ email: renterEmail });
    if (!renter) {
      return res.status(404).json({ message: "Renter not found in database" });
    }

    // ✅ Prevent duplicate pending rentals
    const existingRental = await Rental.findOne({
      bookId,
      renterEmail,
      status: "pending"
    });
    if (existingRental) {
      return res
        .status(400)
        .json({ message: "You already have an active rental for this book." });
    }

    // ✅ Create rental document
    const rental = new Rental({
      bookId,
      bookTitle,
      bookAuthor,
      bookPrice,
      quality: bookQuality || "N/A",
      rentalDuration,
      startDate,
      endDate,
      ownerEmail: owner.email,
      ownerName: owner.name,
      ownerDept: owner.department || "N/A",
      ownerYear: owner.year || "N/A",
      ownerSection: owner.section || "N/A",
      ownerUPI: owner.upi,
      renterEmail: renter.email,
      renterName: renter.name,
      renterDept: renter.department || "N/A",
      renterYear: renter.year || "N/A",
      renterSection: renter.section || "N/A",
      renterUPI: renter.upi,
      paymentMode: "UPI",
      upi,
      status: "completed"
    });

    await rental.save();

    // ✅ Mark book as unavailable
    book.isAvailable = false;
    await book.save();

    res.status(201).json({ message: "Rental successful", rental });
  } catch (err) {
    console.error("❌ Error in createRental:", err);
    res
      .status(500)
      .json({ message: "Failed to create rental", error: err.message });
  }
};

// ✅ Get rentals for a user
export const getUserRentals = async (req, res) => {
  try {
    const { email } = req.params;
    const rentals = await Rental.find({ renterEmail: email }).sort({
      createdAt: -1
    });
    res.json(rentals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all rentals (for admin)
export const getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find().sort({ createdAt: -1 });
    res.json(rentals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get rented books for a specific owner
export const getRentedBooksByOwner = async (req, res) => {
  try {
    const { ownerEmail } = req.params;

    // Fetch completed rentals by this owner
    const rentals = await Rental.find({
      ownerEmail,
      status: "completed"
    });

    const bookIds = rentals.map((r) => r.bookId);

    // Find corresponding books that are currently rented out
    const books = await Book.find({
      _id: { $in: bookIds },
      mode: "rental",
      isAvailable: false
    });

    // Combine book + rental details
    const combined = books.map((book) => ({
      book,
      rental: rentals.find(
        (r) => r.bookId.toString() === book._id.toString()
      )
    }));

    res.json(combined);
  } catch (err) {
    console.error("Error fetching rented books:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
