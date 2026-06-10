import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number }, // Required only for rental
  mode: { type: String, enum: ["rental", "exchange"], required: true },
  rentalDuration: { type: String }, // Only for rental
  quality: { type: String, enum: ["low", "medium", "high"], required: true },
  ownerEmail: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
    imageUrl: { type: String, required: true }, // <--- Add this line
}, { collection: "books" });

export default mongoose.model("Book", bookSchema);
