import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    oldQuantity: Number,
    newQuantity: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("History", historySchema);
