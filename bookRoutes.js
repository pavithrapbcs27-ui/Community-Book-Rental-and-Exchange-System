import express from "express";
import { addBook, getBooks, searchBooks, updateAvailability, getUserBooks } from "../controllers/bookController.js";

const router = express.Router();

// Wrap the routes in a default function export that accepts the 'upload' middleware instance
export default (upload) => {

  // Add a new book (with image upload middleware applied here)
  router.post('/add', upload.single('image'), addBook); 
  
  // Get all available books
  router.get("/", getBooks);

  // Search books by title or author
  router.get("/search", searchBooks);

  // Update availability (Using PUT/PATCH for updates is standard REST practice)
  router.patch("/:id/availability", updateAvailability);

  // Get all books for a specific user
  // NOTE: I corrected the path here. It should be relative to the base /api/books route.
  router.get("/user/:email", getUserBooks); 

  return router;
};
