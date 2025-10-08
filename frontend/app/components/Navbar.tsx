"use client";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import api from "../utils/api";
import ExportCSV from "./ExportCSV";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Example import handler
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/products/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Products imported successfully!");
    } catch (err) {
      toast.error("Failed to import products.");
    }
  };

  // Example logout handler
  const handleLogout = () => {
    // Add your logout logic here
    toast.success("Logged out!");
    router.push("/login");
  };

  return (
    <nav className="bg-blue-900 text-white p-3 flex flex-wrap  shadow-md relative">
      <div className="ml-4 flex items-center space-x-3">
      <img src="https://static.vecteezy.com/system/resources/thumbnails/041/270/283/small_2x/inventory-filled-outline-icon-design-illustration-manufacturing-units-symbol-on-white-background-eps-10-file-vector.jpg" 
      alt="Logo" className="h-8 rounded-full" />
      <h1
        onClick={() => router.push("/")}
        className="text-xl font-bold cursor-pointer sm:text-2xl md:text-3xl  flex-grow"
      >
        Inventory Management
      </h1>
      </div>

      {/* Hamburger for small screens */}
      <div className="flex lg:hidden ml-auto mr-12 justify-self-end">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white focus:outline-none"
        >
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Buttons for large screens */}
      <div className="hidden lg:flex flex-row space-x-3 items-center ml-auto mr-12 justify-self-end">
        <button
          onClick={() => router.push("/products/add")}
          className="bg-pink-100 hover:bg-pink-300 px-3 py-1 rounded-md text-md text-blue-900 font-semibold"
        >
          + Add New Product
        </button>
        <label className="bg-pink-100 hover:bg-pink-300 px-3 py-1 rounded-md text-md text-blue-900 font-semibold cursor-pointer">
          Import CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleImport}
            className="hidden"
          />
        </label>
        <ExportCSV />
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-md font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Hamburger menu dropdown for small screens */}
      {menuOpen && (
        <div className="absolute top-16 right-6 bg-blue-900 rounded-md shadow-lg flex flex-col items-start p-4 space-y-3 z-50 lg:hidden">
          <button
            onClick={() => {
              router.push("/products/add");
              setMenuOpen(false);
            }}
            className="bg-pink-100 hover:bg-pink-600 px-3 py-1 rounded-md text-sm text-blue-900 font-semibold w-full text-left"
          >
            + Add New Product
          </button>
          <label className="bg-pink-100 hover:bg-pink-600 px-3 py-1 rounded-md text-sm text-blue-900 font-semibold cursor-pointer w-full text-left">
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                handleImport(e);
                setMenuOpen(false);
              }}
              className="hidden"
            />
          </label>
          <div className="w-full">
            <ExportCSV />
          </div>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm w-full text-left"
          >
            Logout
          </button>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </nav>
  );
}