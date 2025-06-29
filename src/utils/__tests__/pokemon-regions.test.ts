import { describe, it, expect } from "vitest"
import { POKEMON_REGIONS, getRegionByPokemonId, getRegionById } from "../pokemon-regions"

describe("pokemon-regions", () => {
  describe("POKEMON_REGIONS", () => {
    it("contains all expected regions", () => {
      const expectedRegions = ["kanto", "johto", "hoenn", "sinnoh", "unova", "kalos", "alola", "galar", "paldea"]

      expect(POKEMON_REGIONS).toHaveLength(expectedRegions.length)

      expectedRegions.forEach((regionId) => {
        const region = POKEMON_REGIONS.find((r) => r.id === regionId)
        expect(region).toBeDefined()
        expect(region?.name).toBeTruthy()
        expect(region?.generation).toBeGreaterThan(0)
        expect(region?.startId).toBeGreaterThan(0)
        expect(region?.endId).toBeGreaterThan(region?.startId || 0)
      })
    })

    it("has non-overlapping ID ranges", () => {
      for (let i = 0; i < POKEMON_REGIONS.length - 1; i++) {
        const currentRegion = POKEMON_REGIONS[i]
        const nextRegion = POKEMON_REGIONS[i + 1]

        expect(currentRegion.endId).toBeLessThan(nextRegion.startId)
      }
    })

    it("has consecutive generations", () => {
      for (let i = 0; i < POKEMON_REGIONS.length; i++) {
        expect(POKEMON_REGIONS[i].generation).toBe(i + 1)
      }
    })
  })

  describe("getRegionByPokemonId", () => {
    it("returns correct region for valid Pokemon IDs", () => {
      expect(getRegionByPokemonId(1)?.id).toBe("kanto")
      expect(getRegionByPokemonId(25)?.id).toBe("kanto") // Pikachu
      expect(getRegionByPokemonId(151)?.id).toBe("kanto") // Mew

      expect(getRegionByPokemonId(152)?.id).toBe("johto")
      expect(getRegionByPokemonId(251)?.id).toBe("johto")

      expect(getRegionByPokemonId(252)?.id).toBe("hoenn")
      expect(getRegionByPokemonId(386)?.id).toBe("hoenn")
    })

    it("returns undefined for invalid Pokemon IDs", () => {
      expect(getRegionByPokemonId(0)).toBeUndefined()
      expect(getRegionByPokemonId(-1)).toBeUndefined()
      expect(getRegionByPokemonId(9999)).toBeUndefined()
    })

    it("handles edge cases correctly", () => {
      // Test boundary values
      expect(getRegionByPokemonId(151)?.id).toBe("kanto")
      expect(getRegionByPokemonId(152)?.id).toBe("johto")
      expect(getRegionByPokemonId(251)?.id).toBe("johto")
      expect(getRegionByPokemonId(252)?.id).toBe("hoenn")
    })
  })

  describe("getRegionById", () => {
    it("returns correct region for valid region IDs", () => {
      expect(getRegionById("kanto")?.name).toBe("Kanto")
      expect(getRegionById("johto")?.name).toBe("Johto")
      expect(getRegionById("hoenn")?.name).toBe("Hoenn")
      expect(getRegionById("sinnoh")?.name).toBe("Sinnoh")
    })

    it("returns undefined for invalid region IDs", () => {
      expect(getRegionById("invalid")).toBeUndefined()
      expect(getRegionById("")).toBeUndefined()
      expect(getRegionById("KANTO")).toBeUndefined() // Case sensitive
    })

    it("is case sensitive", () => {
      expect(getRegionById("kanto")).toBeDefined()
      expect(getRegionById("Kanto")).toBeUndefined()
      expect(getRegionById("KANTO")).toBeUndefined()
    })
  })
})
