import Product from "../models/productModel.js";
import History from "../models/historyModel.js";
import fs from "fs";
import pkg from 'csv-parser';
import csv from "csv-parser";
import { Parser } from 'json2csv';



// ----------------------------
// GET ALL PRODUCTS
// ----------------------------
// controllers/productController.js
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;     // current page
    const limit = parseInt(req.query.limit) || 10;  // items per page
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments();
    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // optional sort

    res.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};


// ----------------------------
// UPDATE PRODUCT (Inline Edit)
// ----------------------------
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const oldProduct = await Product.findById(id);

    if (!oldProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });

    // log stock change
    if (req.body.stock && req.body.stock !== oldProduct.stock) {
      await History.create({
        product: id,
        oldQuantity: oldProduct.stock,
        newQuantity: req.body.stock,
        user: req.user ? req.user._id : null,
      });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

// ----------------------------
// IMPORT PRODUCTS FROM CSV
// ----------------------------

// Import Products
export const importProducts = async (req, res) => {
  try {
    console.log("File received:", req.file); // ✅ check if file arrives

    if (!req.file) {
      console.log("No file received!");
      return res.status(400).json({ message: "CSV file is required" });
    }

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        console.log("Row:", row); // ✅ check CSV rows
        results.push(row);
      })
      .on("end", async () => {
        console.log("CSV parsing finished. Total rows:", results.length);
        let added = 0,
          skipped = 0;

        for (const row of results) {
          console.log("Processing row:", row);

          const { name, unit, category, brand, stock, status } = row;

          if (!name || !unit || !category) {
            skipped++;
            continue;
          }

          const existing = await Product.findOne({ name });
          if (existing) {
            skipped++;
            continue;
          }

          const validStatuses = ["In Stock", "Out of Stock"];

          const normalizedStatus =
            row.status === "Available"
              ? "In Stock"
              : validStatuses.includes(row.status)
              ? row.status
              : "In Stock"; // fallback

          const product = new Product({
            name,
            unit,
            category,
            brand,
            stock: Number(stock) || 0,
            status: normalizedStatus,
            image: null,
});

          await product.save();
          added++;
        }

        res.json({ message: `Imported: ${added}, Skipped: ${skipped}` });
      });
  } catch (err) {
    console.error("Error in importProducts:", err);
    res.status(500).json({ message: "Server error while importing CSV" });
  }
};



// ----------------------------
// EXPORT PRODUCTS TO CSV
// ----------------------------

export const exportProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products to export" });
    }

    const fields = ["name", "unit", "category", "brand", "stock", "status"];
    const parser = new Parser({ fields }); 
    const csv = parser.parse(products);

    res.header("Content-Type", "text/csv");
    res.attachment("products.csv");
    res.send(csv);
  } catch (err) {
    console.error("Error exporting products:", err);
    res.status(500).json({ message: "Server error while exporting products" });
  }
};



// ----------------------------
// GET INVENTORY HISTORY BY PRODUCT ID
// ----------------------------
export const getHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const logs = await History.find({ product: id })
      .populate("user", "name email")
      .sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history", error });
  }
};

// ----------------------------
// CREATE PRODUCT
// ----------------------------
export const createProduct = async (req, res) => {
   console.log("Incoming request body:", req.body);
  try {
    const { name, unit, category, brand, stock, status } = req.body;

    const exists = await Product.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Product with this name already exists" });
    }
    
    const newProduct = await Product.create({
      name,
      unit,
      category,
      brand,
      stock,
      status,
      
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};



// ----------------------------
// DELETE PRODUCT
// ----------------------------
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};