import express from "express";
import {
  createRental,
  getUserRentals,
  getAllRentals,
  getRentedBooksByOwner
} from "../controllers/rentalController.js";

const router = express.Router();

router.post("/create", createRental);
router.get("/user/:email", getUserRentals);
router.get("/all", getAllRentals);
router.get("/rented/:ownerEmail", getRentedBooksByOwner);

export default router;
