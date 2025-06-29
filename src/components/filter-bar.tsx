"use client"

import { Filter, SortAsc, SortDesc } from "lucide-react"
import type { FilterOptions } from "../types/pokemon"

interface FilterBarProps {
  filters: FilterOptions
  onFiltersChange: (filters: Partial<FilterOptions>) => void
}

const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
]

const SORT_OPTIONS = [
  { value: "id", label: "Number" },
  { value: "name", label: "Name" },
  { value: "height", label: "Height" },
  { value: "weight", label: "Weight" },
]

export const FilterBar = ({ filters, onFiltersChange }: FilterBarProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-gray-800">Filters & Sorting</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            value={filters.type}
            onChange={(e) => onFiltersChange({ type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">All Types</option>
            {POKEMON_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFiltersChange({ sortBy: e.target.value as FilterOptions["sortBy"] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
          <button
            onClick={() =>
              onFiltersChange({
                sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
              })
            }
            className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            {filters.sortOrder === "asc" ? (
              <>
                <SortAsc className="h-4 w-4" />
                Ascending
              </>
            ) : (
              <>
                <SortDesc className="h-4 w-4" />
                Descending
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
