import express from "express";
import {
  loginAdmin,
  getAllUsers,
  getAllBooks,
  addRentalBook,
  getAdminByEmail,
  getAllTransactions,
} from "../controllers/adminController.js";

const router = express.Router();

// ✅ Admin login
router.post("/login", loginAdmin);

// ✅ Fetch all users
router.get("/users", getAllUsers);

// ✅ Fetch all books (rental + exchange)
router.get("/books", getAllBooks);

// ✅ Add a new rental book
router.post("/books", addRentalBook);

// ✅ Fetch all completed transactions
router.get("/transactions", getAllTransactions);

// ✅ Fetch admin details by email (keep this last to avoid route conflicts)
router.get("/details/:email", getAdminByEmail);

export default router;
