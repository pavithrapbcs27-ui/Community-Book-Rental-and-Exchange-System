// Install dependencies: npm install express mongoose cors dotenv multer path
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer"; // Import multer
import path from "path";     // Import path (Node.js built-in)

// Import your route files
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import rentalRoutes from "./routes/rentalRoutes.js";
import exchangeRoutes from "./routes/exchangeRoutes.js";

dotenv.config();
const app = express();

// --- Standard Middleware ---
app.use(cors());
app.use(express.json());


// --- Multer Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Files will be saved in the 'uploads/' directory
    // NOTE: Ensure this 'uploads' directory exists in your server's root folder!
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // Unique filename using timestamp + original extension
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

// Initialize multer upload middleware instance
const upload = multer({ storage: storage });


// --- Serve Static Files ---
// This allows the frontend to request images from 'http://localhost:5000/uploads/filename.jpg'
app.use('/uploads', express.static('uploads')); 


// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));


// --- Routes ---
// You will need to modify bookRoutes.js to use the 'upload' middleware instance
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
// Pass the configured 'upload' instance to the book routes router
app.use("/api/books", bookRoutes(upload)); 
app.use("/api/rentals", rentalRoutes);
app.use("/api/exchanges", exchangeRoutes);


// --- Start Server ---
app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);
