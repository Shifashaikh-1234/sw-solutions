"use client";
interface Props {
  filters: { name: string; category: string };
  setFilters: React.Dispatch<
    React.SetStateAction<{ name: string; category: string }>
  >;
}

export default function SearchBar({ filters, setFilters }: Props) {
  return (
    <input
      type="text"
      placeholder="Search products..."
      value={filters.name}
      onChange={(e) => setFilters({ ...filters, name: e.target.value })}
      className="border border-gray-300 sm:ml-4 rounded-md px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
}
