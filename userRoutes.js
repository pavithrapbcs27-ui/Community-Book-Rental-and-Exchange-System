import express from "express";
import { registerUser, loginUser, getUserDetails, updateUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:email", getUserDetails);
router.put("/:email", updateUser); // update profile

export default router;
