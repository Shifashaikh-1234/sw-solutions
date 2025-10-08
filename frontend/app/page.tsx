"use client";
import { useEffect, useState } from "react"; 
import api from "./utils/api";
import Navbar from "./components/Navbar";
import ProductTable from "./components/ProductTable";
import SearchBar from "./components/SearchBar";
import FilterDropdown from "./components/FilterDropdown";
import ImportCSV from "./components/ImportCSV";

export default function DashboardPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState({ name: "", category: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Number of products per page

  // Fetch products with pagination
const fetchProducts = async (pageNumber = 1) => {
  try {
    const res = await api.get(`/products?page=${pageNumber}&limit=${limit}`);
    const data = res.data.products || res.data || [];

    setProducts(data);
    setCategories([
      ...new Set(
        (data as { category: string }[]).map((p) => p.category)
      ),
    ]);
    setTotalPages(res.data.totalPages || 1);
    setPage(res.data.page || 1);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};


  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // Filter logic
  const filtered = products.filter(
    (p: any) =>
      p.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      (filters.category === "" || p.category === filters.category)
  );

  // Pagination Handlers
  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
          <SearchBar filters={filters} setFilters={setFilters} />
          <FilterDropdown
            categories={categories}
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        <ProductTable products={filtered} refresh={() => fetchProducts(page)} />
        <ImportCSV fetchProducts={() => fetchProducts(page)} />

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>

          {/* Numbered Page Buttons */}
          {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => handlePageClick(num)}
              className={`px-3 py-1 rounded ${
                num === page
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <p className="text-center text-gray-500 mt-3">
          Page {page} of {totalPages}
        </p>
      </div>
    </div>
  );
}




// "use client";
// import { useEffect, useState } from "react"; 
// import api from "./utils/api";
// import Navbar from "./components/Navbar";
// import ProductTable from "./components/ProductTable";
// import SearchBar from "./components/SearchBar";
// import FilterDropdown from "./components/FilterDropdown";
// import ImportCSV from "./components/ImportCSV";


// export default function DashboardPage() {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [filters, setFilters] = useState({ name: "", category: "" });

//   const fetchProducts = async () => {
//     const res = await api.get("/products");
//     setProducts(res.data);
//     setCategories([...new Set((res.data as any[]).map((p: any) => p.category))]);

//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const filtered = products.filter(
//     (p: any) =>
//       p.name.toLowerCase().includes(filters.name.toLowerCase()) &&
//       (filters.category === "" || p.category === filters.category)
//   );

//   return (
//     <div>
//       <Navbar />
//       <div className="p-6">
//         <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
//           <SearchBar filters={filters} setFilters={setFilters} />
//           <FilterDropdown
//             categories={categories}
//             filters={filters}
//             setFilters={setFilters}
//           />
//         </div>
//         <ProductTable products={filtered} refresh={fetchProducts} />
//         <ImportCSV fetchProducts={fetchProducts} />
//       </div>
//     </div>
//   );
// }
