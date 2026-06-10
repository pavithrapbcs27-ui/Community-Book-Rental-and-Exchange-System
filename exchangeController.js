import mongoose from "mongoose";
import Exchange from "../models/Exchange.js";
import Book from "../models/Book.js";

// Create new exchange request
export const sendExchangeRequest = async (req, res) => {
  try {
    const { sender, receiver, status } = req.body;
    if (!sender || !receiver) {
      return res.status(400).json({ message: "Sender and receiver details required" });
    }

    // 🧩 Prevent same sender book being used again while a request is pending
    const existing = await Exchange.findOne({
      "sender.book.id": sender.book.id,
      status: "pending"
    });

    if (existing) {
      return res.status(400).json({
        message: "You already used this book in another pending request."
      });
    }

    // 🧩 Prevent same pair of sender and receiver for same books (duplicate)
    const duplicate = await Exchange.findOne({
      "sender.book.id": sender.book.id,
      "receiver.book.id": receiver.book.id,
      "sender.email": sender.email,
      "receiver.email": receiver.email
    });

    if (duplicate) {
      return res.status(400).json({
        message: "Duplicate exchange request detected."
      });
    }

    // ✅ Create and save new exchange request
    const newExchange = new Exchange({
      sender,
      receiver,
      status: status || "pending",
      createdAt: new Date(),
    });

    const savedExchange = await newExchange.save();
    res.status(201).json({
      message: "Exchange request saved successfully!",
      exchange: savedExchange,
    });
  } catch (err) {
    console.error("sendExchangeRequest error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get sent exchanges for a user
export const getSentExchanges = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const sent = await Exchange.find({ "sender.email": email });
    res.json(sent);
  } catch (err) {
    console.error("getSentExchanges error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get received exchanges for a user
export const getReceivedExchanges = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const received = await Exchange.find({ "receiver.email": email });
    res.json(received);
  } catch (err) {
    console.error("getReceivedExchanges error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Accept an exchange
export const acceptExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);
    if (!exchange) return res.status(404).json({ message: "Exchange not found" });

    const senderBook = await Book.findById(exchange.sender.book.id);
    const receiverBook = await Book.findById(exchange.receiver.book.id);

    if (!senderBook || !receiverBook)
      return res.status(404).json({ message: "Book not found" });

    if (!senderBook.isAvailable || !receiverBook.isAvailable)
      return res.status(400).json({ message: "One of the books is no longer available" });

    // Mark exchange completed
    exchange.status = "Completed";
    await exchange.save();

    // Mark both books unavailable
    senderBook.isAvailable = false;
    receiverBook.isAvailable = false;
    await senderBook.save();
    await receiverBook.save();

    // Reject all other pending exchanges involving the same receiver book
    await Exchange.updateMany(
      {
        _id: { $ne: exchange._id },
        status: "pending",
        $or: [
          { "receiver.book.id": exchange.receiver.book.id },
          { "sender.book.id": exchange.receiver.book.id },
        ],
      },
      { $set: { status: "Rejected" } }
    );

    res.json({
      message: "Exchange accepted, books updated, other requests rejected!",
      exchange,
    });
  } catch (err) {
    console.error("acceptExchange error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject an exchange
export const rejectExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );
    if (!exchange) return res.status(404).json({ message: "Exchange not found" });
    res.json({ message: "Exchange rejected!", exchange });
  } catch (err) {
    console.error("rejectExchange error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel an exchange (delete request)
export const cancelExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);
    if (!exchange) return res.status(404).json({ message: "Exchange not found" });

    await Exchange.findByIdAndDelete(req.params.id);
    res.json({ message: "Request deleted successfully" });
  } catch (err) {
    console.error("cancelExchange error:", err);
    res.status(500).json({ message: "Failed to delete exchange" });
  }
};

// Get user exchanges
export const getUserExchanges = async (req, res) => {
  try {
    const userEmail = req.params.email;

    const exchanges = await Exchange.find({
      $or: [{ "sender.email": userEmail }, { "receiver.email": userEmail }],
    })
      .populate("sender.book")
      .populate("receiver.book");

    res.json(exchanges);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
