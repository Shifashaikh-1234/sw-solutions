"use client";
import { useState } from "react";
import api from "../../utils/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"; // if using react-hot-toast

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    unit: "",
    category: "",
    brand: "",
    stock: 0,
    status: "In Stock",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "stock" ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/products/add", {
        name: form.name,
        unit: form.unit,
        category: form.category,
        brand: form.brand,
        stock: form.stock,
        status: form.status,
      });

      toast.success("Product added successfully!");
      router.push("/"); // Redirect to dashboard/home page
    } 
    // @ts-ignore
    catch (err: any) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.message || "Error adding product");
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-lg space-y-4"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Add New Product</h1>
        {error && <p className="text-red-500">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="unit"
          placeholder="Unit (e.g., pcs, kg)"
          value={form.unit}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={form.brand}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded w-full hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
