import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { fetchPokemonWithCache, fetchPokemonBatch, fetchRegionPokemon, pokemonMemoryCache } from "../pokemon-cache"
import { mockPokemonAPI } from "../../test/mocks/pokemon-data"
import type { PokemonAPI } from "../../types/api/pokemon"
import type { Pokemon } from "../../types/pokemon"

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe("pokemon-cache", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    pokemonMemoryCache.clear()
    console.error = vi.fn()
  })

  afterEach(() => {
    console.error = vi.fn()
  })

  describe("fetchPokemonWithCache", () => {
    it("fetches pokemon from API when not cached", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemonAPI),
      } as Response)

      const result = await fetchPokemonWithCache(1)

      expect(mockFetch).toHaveBeenCalledWith(
        "https://pokeapi.co/api/v2/pokemon/1",
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      )
      expect(result).toMatchObject({
        id: 1,
        name: "bulbasaur",
        types: expect.any(Array),
      })
    })

    it("returns cached pokemon when available", async () => {
      // First call - should fetch from API
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemonAPI),
      } as Response)

      await fetchPokemonWithCache(1)

      // Second call - should use cache
      const result = await fetchPokemonWithCache(1)

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(result).toMatchObject({
        id: 1,
        name: "bulbasaur",
      })
    })

    it("handles API errors gracefully", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"))

      const result = await fetchPokemonWithCache(1)

      expect(result).toBeNull()
    })

    it("handles non-ok responses", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      const result = await fetchPokemonWithCache(1)

      expect(result).toBeNull()
    })
  })

  describe("fetchPokemonBatch", () => {
    it("fetches multiple pokemon", async () => {
      const createMockResponse = (id: number): PokemonAPI => ({
        ...mockPokemonAPI,
        id,
        name: `pokemon-${id}`,
      })

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(createMockResponse(1)),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(createMockResponse(2)),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(createMockResponse(3)),
        } as Response)

      const result = await fetchPokemonBatch(1, 3)

      expect(result).toHaveLength(3)
      expect(result[0]?.id).toBe(1)
      expect(result[1]?.id).toBe(2)
      expect(result[2]?.id).toBe(3)
    })

    it("filters out failed requests", async () => {
      const createMockResponse = (id: number): PokemonAPI => ({
        ...mockPokemonAPI,
        id,
        name: `pokemon-${id}`,
      })

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(createMockResponse(1)),
        } as Response)
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(createMockResponse(3)),
        } as Response)

      const result = await fetchPokemonBatch(1, 3)

      expect(result).toHaveLength(2)
      expect(result[0]?.id).toBe(1)
      expect(result[1]?.id).toBe(3)
    })
  })

  describe("fetchRegionPokemon", () => {
    it("fetches pokemon for a region using list API", async () => {
      const createMockResponse = (id: number): PokemonAPI => ({
        ...mockPokemonAPI,
        id,
        name: `pokemon-${id}`,
      })

      // Mock the list API response
      const mockListResponse = {
        count: 2,
        next: null,
        previous: null,
        results: [
          { name: "pokemon-1", url: "https://pokeapi.co/api/v2/pokemon/1/" },
          { name: "pokemon-2", url: "https://pokeapi.co/api/v2/pokemon/2/" },
        ],
      }

      // Mock fetch to handle both list API and individual Pokemon calls
      mockFetch.mockImplementation((url) => {
        if (typeof url === "string") {
          if (url.includes("pokemon?limit=2&offset=0")) {
            // List API call
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(mockListResponse),
            } as Response)
          }
          if (url.includes("pokemon/1")) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(createMockResponse(1)),
            } as Response)
          }
          if (url.includes("pokemon/2")) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(createMockResponse(2)),
            } as Response)
          }
        }
        return Promise.reject(new Error(`Unexpected URL: ${url}`))
      })

      const result = await fetchRegionPokemon(1, 2)

      expect(result).toHaveLength(2)
      expect(result[0]?.id).toBe(1)
      expect(result[1]?.id).toBe(2)
    })

    it("falls back to individual fetching when list API fails", async () => {
      const createMockResponse = (id: number): PokemonAPI => ({
        ...mockPokemonAPI,
        id,
        name: `pokemon-${id}`,
      })

      // Mock fetch to simulate list API failure and successful individual calls
      mockFetch.mockImplementation((url) => {
        if (typeof url === "string") {
          if (url.includes("pokemon?limit=")) {
            // Simulate list API failure
            return Promise.reject(new Error("List API failed"))
          }
          if (url.includes("pokemon/1")) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(createMockResponse(1)),
            } as Response)
          }
          if (url.includes("pokemon/2")) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(createMockResponse(2)),
            } as Response)
          }
        }
        return Promise.reject(new Error(`Unexpected URL: ${url}`))
      })

      const result = await fetchRegionPokemon(1, 2)

      expect(result).toHaveLength(2)
      expect(result[0]?.id).toBe(1)
      expect(result[1]?.id).toBe(2)
    })

    it("calls progress callback during loading", async () => {
      const mockOnProgress = vi.fn<(current: number, total: number) => void>()

      const createMockResponse = (id: number): PokemonAPI => ({
        ...mockPokemonAPI,
        id,
        name: `pokemon-${id}`,
      })

      const mockListResponse = {
        count: 2,
        next: null,
        previous: null,
        results: [
          { name: "pokemon-1", url: "https://pokeapi.co/api/v2/pokemon/1/" },
          { name: "pokemon-2", url: "https://pokeapi.co/api/v2/pokemon/2/" },
        ],
      }

      mockFetch.mockImplementation((url) => {
        if (typeof url === "string") {
          if (url.includes("pokemon?limit=2&offset=0")) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(mockListResponse),
            } as Response)
          }
          if (url.includes("pokemon/1")) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(createMockResponse(1)),
            } as Response)
          }
          if (url.includes("pokemon/2")) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(createMockResponse(2)),
            } as Response)
          }
        }
        return Promise.reject(new Error(`Unexpected URL: ${url}`))
      })

      await fetchRegionPokemon(1, 2, mockOnProgress)

      expect(mockOnProgress).toHaveBeenCalled()
      // Should be called at least twice: initial (0, 2) and final (2, 2)
      expect(mockOnProgress).toHaveBeenCalledWith(0, 2)
      expect(mockOnProgress).toHaveBeenCalledWith(2, 2)
    })

    it("sorts results by ID", async () => {
      const createMockResponse = (id: number): PokemonAPI => ({
        ...mockPokemonAPI,
        id,
        name: `pokemon-${id}`,
      })

      const mockListResponse = {
        count: 3,
        next: null,
        previous: null,
        results: [
          { name: "pokemon-3", url: "https://pokeapi.co/api/v2/pokemon/3/" },
          { name: "pokemon-1", url: "https://pokeapi.co/api/v2/pokemon/1/" },
          { name: "pokemon-2", url: "https://pokeapi.co/api/v2/pokemon/2/" },
        ],
      }

      mockFetch.mockImplementation((url) => {
        if (typeof url === "string") {
          if (url.includes("pokemon?limit=3&offset=0")) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(mockListResponse),
            } as Response)
          }
          if (url.includes("pokemon/1")) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(createMockResponse(1)),
            } as Response)
          }
          if (url.includes("pokemon/2")) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(createMockResponse(2)),
            } as Response)
          }
          if (url.includes("pokemon/3")) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(createMockResponse(3)),
            } as Response)
          }
        }
        return Promise.reject(new Error(`Unexpected URL: ${url}`))
      })

      const result = await fetchRegionPokemon(1, 3)

      expect(result).toHaveLength(3)
      expect(result[0]?.id).toBe(1)
      expect(result[1]?.id).toBe(2)
      expect(result[2]?.id).toBe(3)
    })

    it("handles partial failures gracefully", async () => {
      const createMockResponse = (id: number): PokemonAPI => ({
        ...mockPokemonAPI,
        id,
        name: `pokemon-${id}`,
      })

      const mockListResponse = {
        count: 3,
        next: null,
        previous: null,
        results: [
          { name: "pokemon-1", url: "https://pokeapi.co/api/v2/pokemon/1/" },
          { name: "pokemon-2", url: "https://pokeapi.co/api/v2/pokemon/2/" },
          { name: "pokemon-3", url: "https://pokeapi.co/api/v2/pokemon/3/" },
        ],
      }

      mockFetch.mockImplementation((url) => {
        if (typeof url === "string") {
          if (url.includes("pokemon?limit=3&offset=0")) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(mockListResponse),
            } as Response)
          }
          if (url.includes("pokemon/1")) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(createMockResponse(1)),
            } as Response)
          }
          if (url.includes("pokemon/2")) {
            // Simulate failure for pokemon 2
            return Promise.reject(new Error("Network error"))
          }
          if (url.includes("pokemon/3")) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(createMockResponse(3)),
            } as Response)
          }
        }
        return Promise.reject(new Error(`Unexpected URL: ${url}`))
      })

      const result = await fetchRegionPokemon(1, 3)

      // Should get 2 out of 3 Pokemon (1 and 3, but not 2 due to failure)
      expect(result).toHaveLength(2)
      expect(result[0]?.id).toBe(1)
      expect(result[1]?.id).toBe(3)
    })

    it("handles complete list API failure and falls back successfully", async () => {
      const createMockResponse = (id: number): PokemonAPI => ({
        ...mockPokemonAPI,
        id,
        name: `pokemon-${id}`,
      })

      // Mock fetch to fail list API but succeed on individual calls
      mockFetch.mockImplementation((url) => {
        if (typeof url === "string") {
          if (url.includes("pokemon?limit=")) {
            // Always fail list API
            return Promise.reject(new Error("List API unavailable"))
          }
          if (url.includes("pokemon/1")) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(createMockResponse(1)),
            } as Response)
          }
          if (url.includes("pokemon/2")) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve(createMockResponse(2)),
            } as Response)
          }
        }
        return Promise.reject(new Error(`Unexpected URL: ${url}`))
      })

      const result = await fetchRegionPokemon(1, 2)

      expect(result).toHaveLength(2)
      expect(result[0]?.id).toBe(1)
      expect(result[1]?.id).toBe(2)
    })
  })

  describe("pokemonMemoryCache", () => {
    it("stores and retrieves data correctly", () => {
      const testData: Pokemon = {
        id: 1,
        name: "test",
        sprites: {
          front_default: "test.png",
          other: { "official-artwork": { front_default: "test.png" } },
        },
        types: [],
        height: 10,
        weight: 100,
        stats: [],
        abilities: [],
        moves: [],
      }

      pokemonMemoryCache.set("test-key", testData)
      const result = pokemonMemoryCache.get("test-key")

      expect(result).toEqual(testData)
    })

    it("returns null for non-existent keys", () => {
      const result = pokemonMemoryCache.get("non-existent")

      expect(result).toBeNull()
    })

    it("clears all data", () => {
      const testData: Pokemon = {
        id: 1,
        name: "test",
        sprites: {
          front_default: "test.png",
          other: { "official-artwork": { front_default: "test.png" } },
        },
        types: [],
        height: 10,
        weight: 100,
        stats: [],
        abilities: [],
        moves: [],
      }

      pokemonMemoryCache.set("test-key", testData)
      pokemonMemoryCache.clear()

      const result = pokemonMemoryCache.get("test-key")
      expect(result).toBeNull()
    })

    it("reports correct size", () => {
      expect(pokemonMemoryCache.size()).toBe(0)

      const testData: Pokemon = {
        id: 1,
        name: "test",
        sprites: {
          front_default: "test.png",
          other: { "official-artwork": { front_default: "test.png" } },
        },
        types: [],
        height: 10,
        weight: 100,
        stats: [],
        abilities: [],
        moves: [],
      }

      pokemonMemoryCache.set("test-key", testData)
      expect(pokemonMemoryCache.size()).toBe(1)
    })
  })
})
