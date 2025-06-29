"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import type { Pokemon, FilterOptions } from "../types/pokemon"
import { getRegionById } from "../utils/pokemon-regions"
import { fetchRegionPokemon, pokemonMemoryCache } from "../lib/pokemon-cache"

export const usePokemon = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([])
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0 })

  // Pagination state - usando variable de entorno
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(Number(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE) || 10)

  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    type: "",
    secondaryType: "",
    dualType: "",
    sortBy: "id",
    sortOrder: "asc",
    region: "kanto", // Default to Kanto
    heightRange: "",
    weightRange: "",
  })

  // Use useRef for cache to avoid dependency issues
  const regionCacheRef = useRef<Map<string, Pokemon[]>>(new Map())

  // Calculate pagination
  const paginationData = useMemo(() => {
    const totalItems = filteredPokemon.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedPokemon = filteredPokemon.slice(startIndex, endIndex)

    return {
      totalItems,
      totalPages,
      paginatedPokemon,
      startIndex,
      endIndex,
    }
  }, [filteredPokemon, currentPage, itemsPerPage])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [
    filters.search,
    filters.type,
    filters.secondaryType,
    filters.dualType,
    filters.heightRange,
    filters.weightRange,
    filters.sortBy,
    filters.sortOrder,
    filters.region,
  ])

  // Load Pokemon for current region with enhanced caching
  useEffect(() => {
    const loadRegionPokemon = async () => {
      try {
        setLoading(true)
        setError(null)

        const region = getRegionById(filters.region)
        if (!region) {
          setError("Invalid region")
          setLoading(false)
          return
        }

        // Check if we have this region cached in memory
        const regionCacheKey = `${region.id}-${region.startId}-${region.endId}`
        if (regionCacheRef.current.has(regionCacheKey)) {
          const cachedPokemon = regionCacheRef.current.get(regionCacheKey)!
          setPokemonList(cachedPokemon)
          setLoading(false)
          return
        }

        const totalPokemon = region.endId - region.startId + 1
        setLoadingProgress({ current: 0, total: totalPokemon })

        // Progress callback
        const onProgress = (current: number, total: number) => {
          setLoadingProgress({ current, total })

          // Progressive update - show Pokemon as they load
          if (current > 0) {
            // Get currently loaded Pokemon from memory cache
            const loadedPokemon: Pokemon[] = []
            for (let id = region.startId; id <= region.startId + current - 1; id++) {
              const cached = pokemonMemoryCache.get(`pokemon-${id}`)
              if (cached) {
                loadedPokemon.push(cached)
              }
            }
            if (loadedPokemon.length > 0) {
              const sortedPokemon = loadedPokemon.sort((a, b) => a.id - b.id)
              setPokemonList(sortedPokemon)
            }
          }
        }

        // Fetch all Pokemon for the region
        const allPokemon = await fetchRegionPokemon(region.startId, region.endId, onProgress)

        // Cache in memory for faster subsequent access
        regionCacheRef.current.set(regionCacheKey, allPokemon)
        setPokemonList(allPokemon)
        setLoadingProgress({ current: allPokemon.length, total: totalPokemon })
      } catch (err) {
        console.error("Error loading Pokemon data:", err)
        setError("Error loading Pokemon data. Please try again.")
      } finally {
        setLoading(false)
        setLoadingProgress({ current: 0, total: 0 })
      }
    }

    loadRegionPokemon()
  }, [filters.region])

  // Apply filters and sorting
  useEffect(() => {
    // Ensure pokemonList is always an array
    if (!Array.isArray(pokemonList)) {
      setFilteredPokemon([])
      return
    }

    let filtered = [...pokemonList]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          pokemon.id.toString().includes(filters.search),
      )
    }

    // Primary type filter
    if (filters.type) {
      filtered = filtered.filter((pokemon) => pokemon.types.some((type) => type.type.name === filters.type))
    }

    // Secondary type filter
    if (filters.secondaryType) {
      if (filters.secondaryType === "none") {
        filtered = filtered.filter((pokemon) => pokemon.types.length === 1)
      } else {
        filtered = filtered.filter(
          (pokemon) => pokemon.types.length > 1 && pokemon.types[1].type.name === filters.secondaryType,
        )
      }
    }

    // Dual type filter
    if (filters.dualType) {
      if (filters.dualType === "single") {
        filtered = filtered.filter((pokemon) => pokemon.types.length === 1)
      } else if (filters.dualType === "dual") {
        filtered = filtered.filter((pokemon) => pokemon.types.length === 2)
      }
    }

    // Height filter
    if (filters.heightRange) {
      if (filters.heightRange === "short") {
        filtered = filtered.filter((pokemon) => pokemon.height <= 10)
      } else if (filters.heightRange === "medium") {
        filtered = filtered.filter((pokemon) => pokemon.height > 10 && pokemon.height <= 20)
      } else if (filters.heightRange === "tall") {
        filtered = filtered.filter((pokemon) => pokemon.height > 20)
      }
    }

    // Weight filter
    if (filters.weightRange) {
      if (filters.weightRange === "light") {
        filtered = filtered.filter((pokemon) => pokemon.weight <= 250)
      } else if (filters.weightRange === "medium") {
        filtered = filtered.filter((pokemon) => pokemon.weight > 250 && pokemon.weight <= 1000)
      } else if (filters.weightRange === "heavy") {
        filtered = filtered.filter((pokemon) => pokemon.weight > 1000)
      }
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (filters.sortBy) {
        case "name":
          aValue = a.name
          bValue = b.name
          break
        case "height":
          aValue = a.height
          bValue = b.height
          break
        case "weight":
          aValue = a.weight
          bValue = b.weight
          break
        default:
          aValue = a.id
          bValue = b.id
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return filters.sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return filters.sortOrder === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number)
    })

    setFilteredPokemon(filtered)
  }, [pokemonList, filters])

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const changeRegion = (regionId: string) => {
    updateFilters({
      region: regionId,
      search: "",
      type: "",
      secondaryType: "",
      dualType: "",
      heightRange: "",
      weightRange: "",
    })
  }

  // Clear cache function for manual cache management
  const clearCache = useCallback(() => {
    regionCacheRef.current.clear()
    pokemonMemoryCache.clear()
  }, [])

  // Pagination functions
  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= paginationData.totalPages) {
        setCurrentPage(page)
        // Scroll to top when changing pages
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    },
    [paginationData.totalPages],
  )

  const nextPage = useCallback(() => {
    if (currentPage < paginationData.totalPages) {
      goToPage(currentPage + 1)
    }
  }, [currentPage, paginationData.totalPages, goToPage])

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }, [currentPage, goToPage])

  return {
    // Original data
    pokemonList: paginationData.paginatedPokemon, // Return paginated results
    allPokemon: filteredPokemon, // All filtered pokemon for stats
    loading,
    loadingProgress,
    error,
    filters,
    updateFilters,
    changeRegion,
    clearCache,
    cacheSize: pokemonMemoryCache.size(),

    // Pagination data
    pagination: {
      currentPage,
      totalPages: paginationData.totalPages,
      totalItems: paginationData.totalItems,
      itemsPerPage,
      goToPage,
      nextPage,
      prevPage,
    },
  }
}
