"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { Pokemon } from "../types/pokemon"
import { usePokemon } from "../hooks/use-pokemon"
import { RegionNavigation } from "../components/region-navigation"
import { RegionInfo } from "../components/region-info"
import { SearchBar } from "../components/search-bar"
import { AdvancedSearch } from "../components/advanced-search"
import { SurpriseButton } from "../components/surprise-button"
import { SortDropdown } from "../components/sort-dropdown"
import { PokemonGrid } from "../components/pokemon-grid"
import { PokemonModal } from "../components/pokemon-modal"
import { LoadingSpinner } from "../components/loading-spinner"
import { Pagination } from "../components/pagination"

export default function Home() {
  const {
    pokemonList,
    allPokemon,
    loading,
    loadingProgress,
    error,
    filters,
    updateFilters,
    changeRegion,
    pagination,
  } = usePokemon()

  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPokemon(null)
  }

  if (error) {
    return (
      <motion.div
        className="min-h-screen pokemon-main-bg flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="text-center max-w-md mx-auto px-4"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{
              rotate: [-10, 10],
              scale: [1, 1.1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              repeatType: "reverse",
            }}
          >
            ⚠️
          </motion.div>
          <div className="text-red-500 text-xl font-bold mb-2">Error</div>
          <div className="text-white mb-4">{error}</div>
          <motion.button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Region Navigation */}
      <RegionNavigation activeRegion={filters.region} onRegionChange={changeRegion} />

      {/* Main Content */}
      <div className="pokemon-main-bg min-h-screen">
        <div className="px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Region Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <RegionInfo regionId={filters.region} pokemonCount={pagination.totalItems} />
            </motion.div>
            {/* Pagination Info */}
            {!loading && pagination.totalItems > 0 && (
              <motion.div
                className="bg-blue-900 bg-opacity-50 rounded-lg p-3 mb-6 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 }}
              >
                <div className="flex items-center justify-between text-blue-200 text-sm">
                  <motion.span initial={{ x: -20 }} animate={{ x: 0 }} transition={{ delay: 0.45 }}>
                    📄 Page {pagination.currentPage} of {pagination.totalPages} • Showing {pokemonList.length} of{" "}
                    {pagination.totalItems} Pokémon
                  </motion.span>
                  <motion.span
                    className="text-blue-300 text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {pagination.itemsPerPage} per page
                  </motion.span>
                </div>
              </motion.div>
            )}

            {/* Search Section */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 "
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Search Input */}
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <h2 className="text-white text-lg font-medium mb-4">Name or Number</h2>
                <SearchBar
                  value={filters.search}
                  onChange={(value) => updateFilters({ search: value })}
                  placeholder="Search Pokémon..."
                />
                <p className="text-gray-400 text-sm mt-2">
                  Use the Advanced Search to explore Pokémon by type, weakness, Ability, and more!
                </p>
              </motion.div>

              {/* Info Box */}
              <motion.div
                className="bg-green-600 rounded-lg p-4 text-white"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <p className="font-medium">
                  Search for a Pokémon by name or using its National Pokédex number in the{" "}
                  {filters.region.charAt(0).toUpperCase() + filters.region.slice(1)} region.
                </p>
              </motion.div>
            </motion.div>

            {/* Advanced Search */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <AdvancedSearch filters={filters} onFiltersChange={updateFilters} />
            </motion.div>

            {/* Controls Section */}
            <motion.div
              className="bg-white rounded-lg p-6 mb-8 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <motion.div className="w-full md:w-auto" whileHover={{ scale: 1.02 }}>
                  <SurpriseButton pokemonList={allPokemon} onPokemonSelect={handlePokemonClick} />
                </motion.div>
                <motion.div className="w-full md:w-auto" whileHover={{ scale: 1.02 }}>
                  <SortDropdown filters={filters} onFiltersChange={updateFilters} />
                </motion.div>
              </div>
            </motion.div>

            {/* Pokemon Grid */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              {loading ? (
                <LoadingSpinner
                  message={loadingProgress.total > 0 ? "Loading Pokémon with cache..." : "Loading Pokémon..."}
                  showProgress={loadingProgress.total > 0}
                  current={loadingProgress.current}
                  total={loadingProgress.total}
                />
              ) : (
                <>
                  <PokemonGrid pokemon={pokemonList} onPokemonClick={handlePokemonClick} />

                  {/* Pagination */}
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={pagination.goToPage}
                    totalItems={pagination.totalItems}
                    itemsPerPage={pagination.itemsPerPage}
                  />
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <PokemonModal pokemon={selectedPokemon} isOpen={isModalOpen} onClose={handleCloseModal} />
    </motion.div>
  )
}
