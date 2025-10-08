"use client";
import { useState } from "react";
import api from "../utils/api";
import HistorySidebar from "./HistorySidebar";
import ConfirmModal from "./ConfirmModal";
import { toast } from "react-toastify";

interface Product {
  _id: string;
  image: string;
  name: string;
  unit: string;
  category: string;
  brand: string;
  stock: number;
  status: string;
}

interface Props {
  products: Product[];
  refresh: () => void;
}

export default function ProductTable({ products, refresh }: Props) {
  const [editId, setEditId] = useState<string | null>(null);
  const [edited, setEdited] = useState<Partial<Product>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEdit = (product: Product) => {
    setEditId(product._id);
    setEdited(product);
  };

  const handleSave = async (id: string) => {
    setLoading(true);
    try {
      await api.put(`/products/${id}`, edited);
      toast.success("Product updated successfully!");
      setEditId(null);
      refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;
    setLoading(true);
    try {
      await api.delete(`/products/${deleteProductId}`);
      toast.success("Product deleted successfully!");
      refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleteProductId(null);
      setLoading(false);
    }
  };
 


  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg relative flex justify-center align-center m-5">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 ">
          <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}

      <div className="w-full flex justify-center align-center">
      <table className="min-w-full xl:text-md lg:text-md pl-3">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-center">Name</th>
            <th className="p-3 text-center">Unit</th>
            <th className="p-3 text-center">Category</th>
            <th className="p-3 text-center">Brand</th>
            <th className="p-3 text-center">Stock</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr
              key={p._id}
              className="border-b hover:bg-gray-50 transition cursor-pointer ml-2"
              onClick={() => setSelectedProduct(p)}
            >

              <td className="p-3 text-center">
                {editId === p._id ? (
                  <input
                    value={edited.name || ""}
                    onChange={(e) =>
                      setEdited({ ...edited, name: e.target.value })
                    }
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  p.name
                )}
              </td>

              <td className="p-3 text-center">{p.unit}</td>
              <td className="p-3 text-center">{p.category}</td>
              <td className="p-3 text-center">{p.brand}</td>

              <td className="p-3 text-center">
                {editId === p._id ? (
                  <input
                    type="number"
                    value={edited.stock || 0}
                    onChange={(e) =>
                      setEdited({
                        ...edited,
                        stock: parseInt(e.target.value),
                      })
                    }
                    className="border p-1 rounded w-20"
                  />
                ) : (
                  p.stock
                )}
              </td>

              <td className="p-3 text-center">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    p.stock <= 0
                      ? "bg-red-200 text-red-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {p.stock <= 0 ? "Out of Stock" : "In Stock"}
                </span>
              </td>

              <td className="p-3 text-center space-x-2">
                {editId === p._id ? (
                  <button
                    onClick={() => handleSave(p._id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-blue-800 text-white px-2 py-1 rounded hover:bg-blue-900"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteProductId(p._id);
                  }}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <ConfirmModal
        isOpen={!!deleteProductId}
        title="Confirm Delete"
        message="Are you sure you want to delete this product?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteProductId(null)}
      />

      {selectedProduct && (
        <HistorySidebar
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
