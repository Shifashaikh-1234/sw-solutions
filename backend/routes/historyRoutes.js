import express from "express";
import { getHistoryByProduct, getAllHistory, createHistory } from "../controllers/historyController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all history (optionally filter by ?product=PRODUCT_ID). Pagination supported.
router.get("/", protect, getAllHistory);

// Create a manual history entry (admin/protected)
router.post("/", protect, createHistory);

// Get history for a single product by productId
router.get("/product/:productId", protect, getHistoryByProduct);

export default router;
