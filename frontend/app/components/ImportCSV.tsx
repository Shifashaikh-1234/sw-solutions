"use client";
import { useRef, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

export default function ImportCSV({ fetchProducts }: { fetchProducts: () => void }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importing, setImporting] = useState(false);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file); // must match backend: upload.single("file")

    try {
      setImporting(true);
      const res = await api.post("/products/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      fetchProducts(); // refresh product table
    } catch (err: any) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.message || "Import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="flex flex-row justify-center p-4 border rounded shadow-sm bg-white">
      <button
        onClick={handleImportClick}
        disabled={importing}
        className="bg-pink-100 hover:bg-pink-300 px-3 py-1 rounded-md text-md text-blue-900 font-semibold cursor-pointer"
      >
        {importing ? "Importing..." : "Import CSV"}
      </button>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
