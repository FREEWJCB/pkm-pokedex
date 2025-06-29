/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act, waitFor } from "../../test/utils"
import { mockPokemonList } from "../../test/mocks/pokemon-data"

// Mock the pokemon-cache module FIRST with factory functions
vi.mock("../../lib/pokemon-cache", () => {
  const mockFetchRegionPokemon = vi.fn()
  const mockPokemonMemoryCache = {
    get: vi.fn(),
    set: vi.fn(),
    clear: vi.fn(),
    size: vi.fn(() => 0),
    has: vi.fn(() => false),
  }

  return {
    fetchRegionPokemon: mockFetchRegionPokemon,
    pokemonMemoryCache: mockPokemonMemoryCache,
  }
})

// Mock the pokemon-regions module
vi.mock("../../utils/pokemon-regions", () => ({
  getRegionById: vi.fn((id: string) => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    startId: 1,
    endId: 151,
    generation: 1,
    image: "/test.png",
    description: "Test region",
  })),
}))

describe("usePokemon", () => {
  // Import after mocking
  let usePokemon: () => ReturnType<typeof import("../use-pokemon").usePokemon>
  let mockFetchRegionPokemon: ReturnType<typeof vi.fn>
  let mockPokemonMemoryCache: any
  beforeEach(async () => {
    // Dynamic import after mocks are set up
    const pokemonModule = await import("../use-pokemon")
    usePokemon = pokemonModule.usePokemon

    const cacheModule = await import("../../lib/pokemon-cache")
    mockFetchRegionPokemon = vi.mocked(cacheModule.fetchRegionPokemon)
    mockPokemonMemoryCache = vi.mocked(cacheModule.pokemonMemoryCache)

    vi.clearAllMocks()
    mockFetchRegionPokemon.mockResolvedValue(mockPokemonList)
    mockPokemonMemoryCache.has.mockReturnValue(false)
    mockPokemonMemoryCache.get.mockReturnValue(null)
    console.error = vi.fn(); 
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("initializes with default values", () => {
    const { result } = renderHook(() => usePokemon())

    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)
    expect(result.current.filters.region).toBe("kanto")
    expect(result.current.filters.sortBy).toBe("id")
    expect(result.current.filters.sortOrder).toBe("asc")
    expect(result.current.pagination.currentPage).toBe(1)
    expect(result.current.pagination.itemsPerPage).toBe(10)
  })

  it("loads pokemon data on mount", async () => {
    const { result } = renderHook(() => usePokemon())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockFetchRegionPokemon).toHaveBeenCalledWith(1, 151, expect.any(Function))
    expect(result.current.pokemonList).toHaveLength(3)
  })

  it("filters pokemon by search term", async () => {
    const { result } = renderHook(() => usePokemon())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.updateFilters({ search: "bulbasaur" })
    })

    await waitFor(() => {
      expect(result.current.pokemonList).toHaveLength(1)
      expect(result.current.pokemonList[0]?.name).toBe("bulbasaur")
    })
  })

  it("filters pokemon by type", async () => {
    const { result } = renderHook(() => usePokemon())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.updateFilters({ type: "grass" })
    })

    await waitFor(() => {
      // All mock pokemon have grass type
      expect(result.current.pokemonList).toHaveLength(3)
    })
  })

  it("sorts pokemon correctly", async () => {
    const { result } = renderHook(() => usePokemon())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.updateFilters({ sortBy: "name", sortOrder: "desc" })
    })

    await waitFor(() => {
      const names = result.current.allPokemon.map((p: { name: string }) => p.name)
      expect(names).toEqual(["venusaur", "ivysaur", "bulbasaur"])
    })
  })

  it("handles pagination correctly", async () => {
    const { result } = renderHook(() => usePokemon())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.pagination.totalItems).toBe(3)
    expect(result.current.pagination.totalPages).toBe(1)
    expect(result.current.pagination.currentPage).toBe(1)
  })

  it("changes page correctly", async () => {
    // Create more pokemon to enable pagination
    const largePokemonList = Array.from({ length: 25 }, (_, i) => ({
      ...mockPokemonList[0],
      id: i + 1,
      name: `pokemon-${i + 1}`,
    }))

    mockFetchRegionPokemon.mockResolvedValue(largePokemonList)

    const { result } = renderHook(() => usePokemon())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Should have multiple pages now
    expect(result.current.pagination.totalPages).toBeGreaterThan(1)

    act(() => {
      result.current.pagination.goToPage(2)
    })

    await waitFor(() => {
      expect(result.current.pagination.currentPage).toBe(2)
    })
  })

  it("resets to first page when filters change", async () => {
    // Create more pokemon to enable pagination
    const largePokemonList = Array.from({ length: 25 }, (_, i) => ({
      ...mockPokemonList[0],
      id: i + 1,
      name: `pokemon-${i + 1}`,
    }))

    mockFetchRegionPokemon.mockResolvedValue(largePokemonList)

    const { result } = renderHook(() => usePokemon())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Go to page 2
    act(() => {
      result.current.pagination.goToPage(2)
    })

    await waitFor(() => {
      expect(result.current.pagination.currentPage).toBe(2)
    })

    // Change filter - should reset to page 1
    act(() => {
      result.current.updateFilters({ search: "test" })
    })

    await waitFor(() => {
      expect(result.current.pagination.currentPage).toBe(1)
    })
  })

  it("changes region correctly", async () => {
    const { result } = renderHook(() => usePokemon())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.changeRegion("johto")
    })

    expect(result.current.filters.region).toBe("johto")
    expect(result.current.filters.search).toBe("")
    expect(result.current.filters.type).toBe("")
  })

  it("handles loading progress correctly", async () => {
    let progressCallback: ((current: number, total: number) => void) | undefined

    // Mock implementation that captures the progress callback and simulates slow loading
    mockFetchRegionPokemon.mockImplementation(
      async (start: number, end: number, onProgress?: (current: number, total: number) => void) => {
        progressCallback = onProgress

        // Return a promise that resolves after some time to simulate loading
        return new Promise((resolve) => {
          setTimeout(() => {
            // Simulate progress updates during loading
            if (onProgress) {
              onProgress(1, 10)
              onProgress(3, 10)
              onProgress(mockPokemonList.length, 10)
            }
            resolve(mockPokemonList)
          }, 50)
        })
      },
    )

    const { result } = renderHook(() => usePokemon())

    // Verify that progress callback was set up
    expect(progressCallback).toBeDefined()

    // Wait for loading to complete
    await waitFor(
      () => {
        expect(result.current.loading).toBe(false)
      },
      { timeout: 1000 },
    )

    // After loading completes, the progress should be reset to 0, 0
    // This is the expected behavior based on the hook implementation
    expect(result.current.loadingProgress.current).toBe(0)
    expect(result.current.loadingProgress.total).toBe(0)

    // Verify that the pokemon were loaded correctly
    expect(result.current.pokemonList).toHaveLength(3)
  })

  it("shows progress during loading", async () => {

    // Mock implementation that simulates gradual loading
    mockFetchRegionPokemon.mockImplementation(
      async (start: number, end: number, onProgress?: (current: number, total: number) => void) => {

        return new Promise((resolve) => {
          let current = 0
          const total = 10

          const interval = setInterval(() => {
            current += 1
            if (onProgress) {
              onProgress(current, total)
            }

            if (current >= total) {
              clearInterval(interval)
              resolve(mockPokemonList)
            }
          }, 10)
        })
      },
    )

    const { result } = renderHook(() => usePokemon())

    // Wait for some progress to be made
    await waitFor(
      () => {
        return result.current.loadingProgress.total > 0
      },
      { timeout: 500 },
    )

    // Verify that progress is being tracked
    expect(result.current.loadingProgress.total).toBeGreaterThan(0)

    // Wait for loading to complete
    await waitFor(
      () => {
        expect(result.current.loading).toBe(false)
      },
      { timeout: 1000 },
    )

    // Verify final state
    expect(result.current.pokemonList).toHaveLength(3)
  })

  it("handles errors correctly", async () => {
    mockFetchRegionPokemon.mockRejectedValue(new Error("API Error"))

    const { result } = renderHook(() => usePokemon())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe("Error loading Pokemon data. Please try again.")
  })

  it("clears cache when requested", async () => {
    const { result } = renderHook(() => usePokemon())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.clearCache()
    })

    expect(mockPokemonMemoryCache.clear).toHaveBeenCalled()
  })

  it("handles empty pokemon list gracefully", async () => {
    mockFetchRegionPokemon.mockResolvedValue([])

    const { result } = renderHook(() => usePokemon())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.pokemonList).toEqual([])
    expect(result.current.allPokemon).toEqual([])
    expect(result.current.pagination.totalItems).toBe(0)
  })

  it("handles invalid region gracefully", async () => {
    // Mock getRegionById to return null for invalid region
    const regionsModule = await import("../../utils/pokemon-regions")
    const mockGetRegionById = vi.mocked(regionsModule.getRegionById)
    mockGetRegionById.mockReturnValueOnce(undefined)

    const { result } = renderHook(() => usePokemon())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe("Invalid region")
  })

  it("uses cached data when available", async () => {
    // Mock cache hit
    mockPokemonMemoryCache.has.mockReturnValue(true)
    mockPokemonMemoryCache.get.mockReturnValue(mockPokemonList[0])

    const { result } = renderHook(() => usePokemon())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Should still call fetchRegionPokemon but might use cached data
    expect(mockFetchRegionPokemon).toHaveBeenCalled()
  })
})
