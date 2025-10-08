"use client";
import { useEffect, useState } from "react";
import api from "../utils/api";

interface Props {
  product: any;
  onClose: () => void;
}

export default function HistorySidebar({ product, onClose }: Props) {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await api.get(`/history/product/${product._id}`);
      setLogs(res.data.logs);
    };
    fetchLogs();
  }, [product]);

  return (
    <div className="fixed top-0 right-0 w-80 sm:w-80 h-full bg-white shadow-lg p-4 border-l border-gray-300 overflow-y-auto z-50">

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">{product.name} History</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 text-xl"
        >
          ×
        </button>
      </div>
      {logs.length === 0 ? (
        <p className="text-gray-500">No history found.</p>
      ) : (
        <ul className="space-y-3">
          {logs.map((log) => (
            <li
              key={log._id}
              className="border p-2 rounded-md text-sm bg-gray-50"
            >
              <p>
                <strong>Date:</strong>{" "}
                {new Date(log.date).toLocaleString()}
              </p>
              <p>
                <strong>Old Qty:</strong> {log.oldQuantity} →{" "}
                <strong>New Qty:</strong> {log.newQuantity}
              </p>
              <p className="text-gray-600">
                <strong>User:</strong> {log.user?.name || "N/A"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
