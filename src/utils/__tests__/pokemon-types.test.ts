import { describe, it, expect } from "vitest"
import { getTypeColor, POKEMON_TYPES } from "../pokemon-types"

describe("pokemon-types", () => {
  describe("POKEMON_TYPES", () => {
    it("contains all expected types", () => {
      const expectedTypes = [
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

      expectedTypes.forEach((type) => {
        expect(POKEMON_TYPES).toHaveProperty(type)
        expect(typeof POKEMON_TYPES[type]).toBe("string")
        expect(POKEMON_TYPES[type]).toMatch(/^#[0-9A-F]{6}$/i)
      })
    })
  })

  describe("getTypeColor", () => {
    it("returns correct color for known types", () => {
      expect(getTypeColor("fire")).toBe("#F08030")
      expect(getTypeColor("water")).toBe("#6890F0")
      expect(getTypeColor("grass")).toBe("#78C850")
      expect(getTypeColor("electric")).toBe("#F8D030")
    })

    it("handles case insensitive input", () => {
      expect(getTypeColor("FIRE")).toBe("#F08030")
      expect(getTypeColor("Fire")).toBe("#F08030")
      expect(getTypeColor("fIrE")).toBe("#F08030")
    })

    it("returns default color for unknown types", () => {
      expect(getTypeColor("unknown")).toBe("#68A090")
      expect(getTypeColor("")).toBe("#68A090")
      expect(getTypeColor("invalid-type")).toBe("#68A090")
    })

    it("returns default color for null/undefined input", () => {
      expect(getTypeColor(null as unknown as string)).toBe("#68A090")
      expect(getTypeColor(undefined as unknown as string)).toBe("#68A090")
    })

    it("handles non-string input", () => {
      expect(getTypeColor(123 as unknown as string)).toBe("#68A090")
      expect(getTypeColor({} as unknown as string)).toBe("#68A090")
      expect(getTypeColor([] as unknown as string)).toBe("#68A090")
    })
  })
})
