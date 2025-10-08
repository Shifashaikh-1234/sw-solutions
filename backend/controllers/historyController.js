import History from "../models/historyModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

/**
 * Get history logs for a single product (sorted desc by date)
 * GET /api/history/product/:productId
 */
export const getHistoryByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) return res.status(400).json({ message: "productId is required" });

    // ensure product exists (optional, helpful for clearer errors)
    const product = await Product.findById(productId).select("_id name");
    if (!product) return res.status(404).json({ message: "Product not found" });

    const logs = await History.find({ product: productId })
      .populate("user", "name email")
      .sort({ date: -1 });

    res.json({ product: { id: product._id, name: product.name }, logs });
  } catch (error) {
    console.error("getHistoryByProduct error:", error);
    res.status(500).json({ message: "Error fetching history", error });
  }
};

/**
 * Get all history logs (optionally filter by productId, with pagination)
 * GET /api/history?product=PRODUCT_ID&page=1&limit=20
 */
export const getAllHistory = async (req, res) => {
  try {
    const { product: productId, page = 1, limit = 50 } = req.query;
    const q = {};
    if (productId) q.product = productId;

    const skip = (Number(page) - 1) * Number(limit);
    const [logs, total] = await Promise.all([
      History.find(q).populate("product", "name").populate("user", "name email").sort({ date: -1 }).skip(skip).limit(Number(limit)),
      History.countDocuments(q),
    ]);

    res.json({ total, page: Number(page), limit: Number(limit), logs });
  } catch (error) {
    console.error("getAllHistory error:", error);
    res.status(500).json({ message: "Error fetching history", error });
  }
};

/**
 * Create a manual history log (useful for admin adjustments)
 * POST /api/history
 * body: { product, oldQuantity, newQuantity, note? }
 * Protected route (req.user available via auth middleware)
 */
export const createHistory = async (req, res) => {
  try {
    const { product, oldQuantity, newQuantity, note } = req.body;
    if (!product || oldQuantity === undefined || newQuantity === undefined) {
      return res.status(400).json({ message: "product, oldQuantity and newQuantity are required" });
    }

    // optional validation: ensure product exists
    const prod = await Product.findById(product);
    if (!prod) return res.status(404).json({ message: "Product not found" });

    const userId = req.user ? req.user._id : null;

    const log = await History.create({
      product,
      oldQuantity: Number(oldQuantity),
      newQuantity: Number(newQuantity),
      user: userId,
      date: new Date(),
      note: note || "",
    });

    return res.status(201).json({ message: "History entry created", log });
  } catch (error) {
    console.error("createHistory error:", error);
    res.status(500).json({ message: "Error creating history entry", error });
  }
};
