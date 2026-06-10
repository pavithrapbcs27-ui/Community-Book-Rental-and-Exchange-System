import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  upi: { type: String, required: true, unique: true }, // Added UPI
  password: { type: String, required: true },
  gender: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: String, required: true },
  section: { type: String, required: true },
  phone: { type: String, required: true }
});

export default mongoose.model("User", userSchema);
