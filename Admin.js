import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name: { type: String, required: true },   // add name
  upi: { type: String, required: true }     // add UPI
}, { collection: "admin" });

export default mongoose.model("Admin", adminSchema);
