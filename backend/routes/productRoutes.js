import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import protect from "../middleware/authMiddleware.js";
import {
  getProducts,
  updateProduct,
  importProducts,
  exportProducts,
  getHistory,
  createProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

// Product routes
router.get("/", protect, getProducts);
router.put("/:id", protect, updateProduct);
router.post("/import", protect, upload.single("file"), importProducts);
router.get("/export", protect, exportProducts);
router.get("/:id/history", protect, getHistory);
router.post("/add", protect, createProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
