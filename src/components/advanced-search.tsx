"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { FilterOptions } from "../types/pokemon"

interface AdvancedSearchProps {
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

export const AdvancedSearch = ({ filters, onFiltersChange }: AdvancedSearchProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-gray-600 rounded-lg">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 text-white font-medium flex items-center justify-center gap-2 hover:bg-gray-500 transition-colors rounded-lg"
      >
        Show Advanced Search
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {/* Advanced Search Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {/* Primary Type Filter */}
            <div>
              <label htmlFor="primary-type-select" className="block text-white text-sm font-medium mb-2">
                Primary Type
              </label>
              <select
                id="primary-type-select"
                value={filters.type}
                onChange={(e) => onFiltersChange({ type: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Type</option>
                {POKEMON_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Secondary Type Filter */}
            <div>
              <label htmlFor="secondary-type-select" className="block text-white text-sm font-medium mb-2">
                Secondary Type
              </label>
              <select
                id="secondary-type-select"
                value={filters.secondaryType || ""}
                onChange={(e) => onFiltersChange({ secondaryType: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any or None</option>
                <option value="none">No Secondary Type</option>
                {POKEMON_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Dual Type Filter */}
            <div>
              <label htmlFor="type-count-select" className="block text-white text-sm font-medium mb-2">
                Type Count
              </label>
              <select
                id="type-count-select"
                value={filters.dualType || ""}
                onChange={(e) => onFiltersChange({ dualType: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="single">Single Type Only</option>
                <option value="dual">Dual Type Only</option>
              </select>
            </div>

            {/* Height Range */}
            <div>
              <label htmlFor="height-range-select" className="block text-white text-sm font-medium mb-2">
                Height
              </label>
              <select
                id="height-range-select"
                value={filters.heightRange || ""}
                onChange={(e) => onFiltersChange({ heightRange: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Height</option>
                <option value="short">Short (0-1m)</option>
                <option value="medium">Medium (1-2m)</option>
                <option value="tall">Tall (2m+)</option>
              </select>
            </div>

            {/* Weight Range */}
            <div>
              <label htmlFor="weight-range-select" className="block text-white text-sm font-medium mb-2">
                Weight
              </label>
              <select
                id="weight-range-select"
                value={filters.weightRange || ""}
                onChange={(e) => onFiltersChange({ weightRange: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Weight</option>
                <option value="light">Light (0-25kg)</option>
                <option value="medium">Medium (25-100kg)</option>
                <option value="heavy">Heavy (100kg+)</option>
              </select>
            </div>
          </div>

          {/* Type Combination Examples */}
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <h4 className="text-white font-medium mb-2">Popular Type Combinations:</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onFiltersChange({ type: "fire", secondaryType: "flying" })}
                className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm transition-colors"
              >
                Fire/Flying
              </button>
              <button
                onClick={() => onFiltersChange({ type: "water", secondaryType: "ground" })}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
              >
                Water/Ground
              </button>
              <button
                onClick={() => onFiltersChange({ type: "grass", secondaryType: "poison" })}
                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition-colors"
              >
                Grass/Poison
              </button>
              <button
                onClick={() => onFiltersChange({ type: "electric", secondaryType: "steel" })}
                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm transition-colors"
              >
                Electric/Steel
              </button>
              <button
                onClick={() => onFiltersChange({ type: "dragon", secondaryType: "flying" })}
                className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm transition-colors"
              >
                Dragon/Flying
              </button>
              <button
                onClick={() => onFiltersChange({ type: "", secondaryType: "", dualType: "dual" })}
                className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm transition-colors"
              >
                All Dual Types
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
