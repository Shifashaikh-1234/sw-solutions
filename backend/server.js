import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
;

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve images publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

dotenv.config();
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/history", historyRoutes);



app.get("/", (req, res) => {
  res.send("Inventory Management Backend Running ✅");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
