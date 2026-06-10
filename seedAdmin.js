// seedAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGO_URI = "mongodb://127.0.0.1:27017/mydatabase";

const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const Admin = mongoose.model("admin", adminSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const email = "admin@gmail.com";
    const plainPassword = "Admin@123";

    // check if already exists
    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log("⚠️ Admin already exists, updating password...");
      const hash = await bcrypt.hash(plainPassword, 10);
      await Admin.updateOne({ email }, { $set: { password: hash } });
      console.log("✅ Admin password updated successfully!");
    } else {
      const hash = await bcrypt.hash(plainPassword, 10);
      const admin = new Admin({ email, password: hash });
      await admin.save();
      console.log("✅ Admin created successfully!");
    }

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

createAdmin();
