import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  bookTitle: { type: String, required: true },
  bookAuthor: { type: String, required: true },
  bookPrice: { type: Number }, // optional for exchange
  rentalDuration: { type: String }, // optional
  quality: { type: String, default: "N/A" },

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  ownerEmail: { type: String, required: true },
  ownerName: { type: String },
  ownerDept: { type: String },
  ownerYear: { type: String },
  ownerSection: { type: String },
  ownerUPI: { type: String, required: true },

  renterEmail: { type: String, required: true },
  renterName: { type: String },
  renterDept: { type: String },
  renterYear: { type: String },
  renterSection: { type: String },
  renterUPI: { type: String, required: true },

  paymentMode: { type: String, default: "UPI" },
  upi: { type: String, required: true },

  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Rental", rentalSchema);
