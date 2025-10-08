"use client";
interface Props {
  categories: string[];
  filters: { name: string; category: string };
  setFilters: React.Dispatch<
    React.SetStateAction<{ name: string; category: string }>
  >;
}

export default function FilterDropdown({ categories, filters, setFilters }: Props) {
  return (
    <select
      value={filters.category}
      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
      className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400 m-2"
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}
