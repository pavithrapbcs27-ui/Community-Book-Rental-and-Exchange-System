// server/routes/exchangeRoutes.js
import express from "express";
import {
  sendExchangeRequest,
  getSentExchanges,
  getReceivedExchanges,
  acceptExchange,
  rejectExchange,
  cancelExchange,
  getUserExchanges
} from "../controllers/exchangeController.js";

const router = express.Router();

// POST new exchange request
router.post("/", sendExchangeRequest);

// GET sent exchanges for a user
router.get("/sent/:email", getSentExchanges);

// GET received exchanges for a user
router.get("/received/:email", getReceivedExchanges);

// PUT accept/reject exchange
router.put("/accept/:id", acceptExchange);
router.put("/reject/:id", rejectExchange);

// DELETE cancel exchange
router.delete("/cancel/:id", cancelExchange);

router.get("/user/:email", getUserExchanges);

export default router;
