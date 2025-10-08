import api from "../utils/api";

export default function ExportCSV() {
  const handleExport = async () => {
    try {
      const res = await api.get("/products/export", { responseType: "blob" });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "products.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed");
    }
  };

  return (
    <button
      onClick={handleExport}
      className="bg-pink-100 hover:bg-pink-300 px-3 py-1 rounded-md text-md text-blue-900 font-semibold"
    >
      Export CSV
    </button>
  );
}
