"use client"

import type { FilterOptions } from "../types/pokemon"

interface SortDropdownProps {
  filters: FilterOptions
  onFiltersChange: (filters: Partial<FilterOptions>) => void
}

const SORT_OPTIONS = [
  { value: "id-asc", label: "Lowest Number (First)", sortBy: "id" as const, sortOrder: "asc" as const },
  { value: "id-desc", label: "Highest Number (First)", sortBy: "id" as const, sortOrder: "desc" as const },
  { value: "name-asc", label: "A-Z", sortBy: "name" as const, sortOrder: "asc" as const },
  { value: "name-desc", label: "Z-A", sortBy: "name" as const, sortOrder: "desc" as const },
]

export const SortDropdown = ({ filters, onFiltersChange }: SortDropdownProps) => {
  const currentValue = `${filters.sortBy}-${filters.sortOrder}`

  const handleSortChange = (value: string) => {
    const option = SORT_OPTIONS.find((opt) => opt.value === value)
    if (option) {
      onFiltersChange({
        sortBy: option.sortBy,
        sortOrder: option.sortOrder,
      })
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-black font-medium" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
        Sort By
      </span>
      <select
        value={currentValue}
        onChange={(e) => handleSortChange(e.target.value)}
        className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px] cursor-pointer"
        style={{
          cursor: "pointer",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            🔢 {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
