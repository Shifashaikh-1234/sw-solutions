import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    
    name: { type: String, required: true, unique: true },
    unit: { type: String },
    category: { type: String },
    brand: { type: String },
    stock: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
