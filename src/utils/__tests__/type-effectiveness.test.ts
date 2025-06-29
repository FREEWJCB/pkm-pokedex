import { describe, it, expect } from "vitest"
import { calculateTypeEffectiveness, TYPE_EFFECTIVENESS } from "../type-effectiveness"

describe("type-effectiveness", () => {
  describe("TYPE_EFFECTIVENESS", () => {
    it("contains data for all Pokemon types", () => {
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
        expect(TYPE_EFFECTIVENESS).toHaveProperty(type)
        const typeData = TYPE_EFFECTIVENESS[type]

        if (typeData) {
          expect(Array.isArray(typeData.weakTo)).toBe(true)
          expect(Array.isArray(typeData.resistantTo)).toBe(true)
          expect(Array.isArray(typeData.immuneTo)).toBe(true)
          expect(Array.isArray(typeData.strongAgainst)).toBe(true)
          expect(Array.isArray(typeData.weakAgainst)).toBe(true)
          expect(Array.isArray(typeData.noEffectAgainst)).toBe(true)
        }
      })
    })

    it("has correct fire type effectiveness", () => {
      const fire = TYPE_EFFECTIVENESS.fire

      expect(fire?.weakTo).toContain("water")
      expect(fire?.weakTo).toContain("ground")
      expect(fire?.weakTo).toContain("rock")

      expect(fire?.strongAgainst).toContain("grass")
      expect(fire?.strongAgainst).toContain("ice")
      expect(fire?.strongAgainst).toContain("bug")
      expect(fire?.strongAgainst).toContain("steel")
    })

    it("has correct water type effectiveness", () => {
      const water = TYPE_EFFECTIVENESS.water

      expect(water?.weakTo).toContain("electric")
      expect(water?.weakTo).toContain("grass")

      expect(water?.strongAgainst).toContain("fire")
      expect(water?.strongAgainst).toContain("ground")
      expect(water?.strongAgainst).toContain("rock")
    })
  })

  describe("calculateTypeEffectiveness", () => {
    it("calculates single type effectiveness correctly", () => {
      const fireEffectiveness = calculateTypeEffectiveness(["fire"])

      expect(fireEffectiveness.weakTo).toContain("water")
      expect(fireEffectiveness.weakTo).toContain("ground")
      expect(fireEffectiveness.weakTo).toContain("rock")

      expect(fireEffectiveness.strongAgainst).toContain("grass")
      expect(fireEffectiveness.strongAgainst).toContain("ice")
    })

    it("calculates dual type effectiveness correctly", () => {
      // Fire/Flying type (like Charizard)
      const fireFlying = calculateTypeEffectiveness(["fire", "flying"])

      // Should be 4x weak to rock (2x from fire, 2x from flying)
      expect(fireFlying.weakTo).toContain("rock")

      // Should resist grass (fire resists, flying neutral = 0.5x)
      expect(fireFlying.resistantTo).toContain("grass")

      // Should be immune to ground (flying immunity overrides fire weakness)
      expect(fireFlying.immuneTo).toContain("ground")
    })

    it("handles immunity correctly in dual types", () => {
      // Normal/Ghost would be immune to Normal, Fighting, and Ghost
      const normalGhost = calculateTypeEffectiveness(["normal", "ghost"])

      expect(normalGhost.immuneTo).toContain("normal")
      expect(normalGhost.immuneTo).toContain("fighting")
    })

    it("handles resistance stacking correctly", () => {
      // Fire/Steel should be very resistant to certain types
      const fireSteel = calculateTypeEffectiveness(["fire", "steel"])

      // Both fire and steel resist ice, so should be 0.25x (very resistant)
      expect(fireSteel.resistantTo).toContain("ice")
    })

    it("returns empty arrays for unknown types", () => {
      const unknown = calculateTypeEffectiveness(["unknown-type"])

      expect(unknown.weakTo).toEqual([])
      expect(unknown.resistantTo).toEqual([])
      expect(unknown.immuneTo).toEqual([])
      expect(unknown.strongAgainst).toEqual([])
      expect(unknown.weakAgainst).toEqual([])
      expect(unknown.noEffectAgainst).toEqual([])
    })

    it("handles empty type array", () => {
      const empty = calculateTypeEffectiveness([])

      expect(empty.weakTo).toEqual([])
      expect(empty.resistantTo).toEqual([])
      expect(empty.immuneTo).toEqual([])
      expect(empty.strongAgainst).toEqual([])
      expect(empty.weakAgainst).toEqual([])
      expect(empty.noEffectAgainst).toEqual([])
    })

    it("handles case insensitive type names", () => {
      const fireUpper = calculateTypeEffectiveness(["FIRE"])
      const fireLower = calculateTypeEffectiveness(["fire"])

      expect(fireUpper.weakTo).toEqual(fireLower.weakTo)
      expect(fireUpper.strongAgainst).toEqual(fireLower.strongAgainst)
    })
  })
})
