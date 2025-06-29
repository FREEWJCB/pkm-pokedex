import { describe, it, expect } from "vitest"
import { render, screen } from "../../../../test/utils"
import { StatsTab } from "../stats-tab"
import { mockPokemonUniqueStats } from "../../../../test/mocks/pokemon-data"

describe("StatsTab", () => {
  it("renders all pokemon stats", () => {
    render(<StatsTab pokemon={mockPokemonUniqueStats} isLegendary={false} />)

    expect(screen.getByText("Base Statistics")).toBeInTheDocument()

    // Use more specific selectors for stat names
    expect(screen.getByText(/^hp$/i)).toBeInTheDocument()
    expect(screen.getByText(/^attack$/i)).toBeInTheDocument()
    expect(screen.getByText(/^defense$/i)).toBeInTheDocument()
    expect(screen.getByText(/^special attack$/i)).toBeInTheDocument()
    expect(screen.getByText(/^special defense$/i)).toBeInTheDocument()
    expect(screen.getByText(/^speed$/i)).toBeInTheDocument()
  })

  it("displays stat values correctly", () => {
    render(<StatsTab pokemon={mockPokemonUniqueStats} isLegendary={false} />)

    // Check that the component renders without errors first
    expect(screen.getByText("Base Statistics")).toBeInTheDocument()

    // Look for stat values in the context of their stat names
    const hpText = screen.getByText(/^hp$/i)
    const hpContainer = hpText.closest('[class*="bg-gray-50"]')
    expect(hpContainer).toHaveTextContent("45")

    const attackText = screen.getByText(/^attack$/i)
    const attackContainer = attackText.closest('[class*="bg-gray-50"]')
    expect(attackContainer).toHaveTextContent("49")

    const defenseText = screen.getByText(/^defense$/i)
    const defenseContainer = defenseText.closest('[class*="bg-gray-50"]')
    expect(defenseContainer).toHaveTextContent("53")
  })

  it("shows legendary indicator when isLegendary is true", () => {
    render(<StatsTab pokemon={mockPokemonUniqueStats} isLegendary={true} />)

    expect(screen.getByText("Legendary Stats!")).toBeInTheDocument()
  })

  it("calculates stat ratings correctly", () => {
    render(<StatsTab pokemon={mockPokemonUniqueStats} isLegendary={false} />)

    // Find HP stat and check its rating
    const hpText = screen.getByText(/^hp$/i)
    const hpContainer = hpText.closest('[class*="bg-gray-50"]')
    expect(hpContainer).toHaveTextContent("LOW")

    // Find attack stat and check its rating
    const attackText = screen.getByText(/^attack$/i)
    const attackContainer = attackText.closest('[class*="bg-gray-50"]')
    expect(attackContainer).toHaveTextContent("LOW")
  })

  it("shows progress bars for each stat", () => {
    const { container } = render(<StatsTab pokemon={mockPokemonUniqueStats} isLegendary={false} />)

    // Look for progress bar containers by their background class
    const progressContainers = container.querySelectorAll('[class*="bg-gray-200"][class*="rounded-full"]')
    expect(progressContainers.length).toBe(6) // Should have 6 progress bars for 6 stats
  })

  it("displays stat percentages", () => {
    render(<StatsTab pokemon={mockPokemonUniqueStats} isLegendary={false} />)

    // Check for percentage text patterns
    expect(screen.getByText("17.6%")).toBeInTheDocument() // HP: 45/255 * 100 = 17.6%
    expect(screen.getByText("19.2%")).toBeInTheDocument() // Attack: 49/255 * 100 = 19.2%
    expect(screen.getByText("20.8%")).toBeInTheDocument() // Defense: 53/255 * 100 = 20.8%
    expect(screen.getByText("25.5%")).toBeInTheDocument() // Special Attack: 65/255 * 100 = 25.5%
    expect(screen.getByText("26.3%")).toBeInTheDocument() // Special Defense: 67/255 * 100 = 26.3%
    expect(screen.getByText("20.0%")).toBeInTheDocument() // Speed: 51/255 * 100 = 20.0%
  })

  it("shows correct stat ratings based on values", () => {
    render(<StatsTab pokemon={mockPokemonUniqueStats} isLegendary={false} />)

    // Find each stat and verify its rating badge
    const hpText = screen.getByText(/^hp$/i)
    const hpContainer = hpText.closest('[class*="bg-gray-50"]')
    expect(hpContainer).toHaveTextContent("LOW") // 45 is below 60 threshold for HP

    const attackText = screen.getByText(/^attack$/i)
    const attackContainer = attackText.closest('[class*="bg-gray-50"]')
    expect(attackContainer).toHaveTextContent("LOW") // 49 is below 70 threshold for attack

    const defenseText = screen.getByText(/^defense$/i)
    const defenseContainer = defenseText.closest('[class*="bg-gray-50"]')
    expect(defenseContainer).toHaveTextContent("LOW") // 53 is below 70 threshold for defense
  })

  it("displays all stat names correctly", () => {
    render(<StatsTab pokemon={mockPokemonUniqueStats} isLegendary={false} />)

    // Check that stat names are properly formatted (hyphens replaced with spaces)
    expect(screen.getByText(/^hp$/i)).toBeInTheDocument()
    expect(screen.getByText(/^attack$/i)).toBeInTheDocument()
    expect(screen.getByText(/^defense$/i)).toBeInTheDocument()
    expect(screen.getByText(/^special attack$/i)).toBeInTheDocument()
    expect(screen.getByText(/^special defense$/i)).toBeInTheDocument()
    expect(screen.getByText(/^speed$/i)).toBeInTheDocument()
  })

  it("shows different ratings for high stat pokemon", () => {
    // Create a pokemon with high stats to test different ratings
    const highStatPokemon = {
      ...mockPokemonUniqueStats,
      stats: [
        { base_stat: 150, stat: { name: "hp" } }, // HIGH (>100)
        { base_stat: 120, stat: { name: "attack" } }, // HIGH (>110)
        { base_stat: 80, stat: { name: "defense" } }, // MEDIUM (70-110)
        { base_stat: 130, stat: { name: "special-attack" } }, // HIGH (>110)
        { base_stat: 90, stat: { name: "special-defense" } }, // MEDIUM (70-110)
        { base_stat: 110, stat: { name: "speed" } }, // HIGH (>100)
      ],
    }

    render(<StatsTab pokemon={highStatPokemon} isLegendary={false} />)

    // Check for HIGH ratings
    const hpText = screen.getByText(/^hp$/i)
    const hpContainer = hpText.closest('[class*="bg-gray-50"]')
    expect(hpContainer).toHaveTextContent("HIGH")

    const attackText = screen.getByText(/^attack$/i)
    const attackContainer = attackText.closest('[class*="bg-gray-50"]')
    expect(attackContainer).toHaveTextContent("HIGH")

    const defenseText = screen.getByText(/^defense$/i)
    const defenseContainer = defenseText.closest('[class*="bg-gray-50"]')
    expect(defenseContainer).toHaveTextContent("MEDIUM")
  })

  it("applies correct styling for legendary pokemon", () => {
    render(<StatsTab pokemon={mockPokemonUniqueStats} isLegendary={true} />)

    // Should show the legendary badge
    const legendaryBadge = screen.getByText("Legendary Stats!")
    expect(legendaryBadge).toBeInTheDocument()

    // Check for the badge classes
    expect(legendaryBadge.closest('[class*="bg-yellow-100"]')).toBeInTheDocument()
  })

  it("renders without crashing with minimal pokemon data", () => {
    const minimalPokemon = {
      ...mockPokemonUniqueStats,
      stats: [{ base_stat: 1, stat: { name: "hp" } }],
    }

    expect(() => {
      render(<StatsTab pokemon={minimalPokemon} isLegendary={false} />)
    }).not.toThrow()

    expect(screen.getByText("Base Statistics")).toBeInTheDocument()
  })

  it("handles edge case stat values correctly", () => {
    const edgeCasePokemon = {
      ...mockPokemonUniqueStats,
      stats: [
        { base_stat: 61, stat: { name: "hp" } }, // MEDIUM (>60, <=100)
        { base_stat: 71, stat: { name: "attack" } }, // MEDIUM (>70, <=110)
        { base_stat: 111, stat: { name: "defense" } }, // HIGH (>110)
        { base_stat: 255, stat: { name: "special-attack" } }, // HIGH (>110)
        { base_stat: 0, stat: { name: "special-defense" } }, // LOW (<70)
        { base_stat: 101, stat: { name: "speed" } }, // HIGH (>100)
      ],
    }

    render(<StatsTab pokemon={edgeCasePokemon} isLegendary={false} />)

    // HP: 61 should be MEDIUM (>60, <=100)
    const hpText = screen.getByText(/^hp$/i)
    const hpContainer = hpText.closest('[class*="bg-gray-50"]')
    expect(hpContainer).toHaveTextContent("MEDIUM")

    // Attack: 71 should be MEDIUM (>70, <=110)
    const attackText = screen.getByText(/^attack$/i)
    const attackContainer = attackText.closest('[class*="bg-gray-50"]')
    expect(attackContainer).toHaveTextContent("MEDIUM")

    // Defense: 111 should be HIGH (>110)
    const defenseText = screen.getByText(/^defense$/i)
    const defenseContainer = defenseText.closest('[class*="bg-gray-50"]')
    expect(defenseContainer).toHaveTextContent("HIGH")

    // Special Defense: 0 should be LOW (<70)
    const specialDefenseText = screen.getByText(/^special defense$/i)
    const specialDefenseContainer = specialDefenseText.closest('[class*="bg-gray-50"]')
    expect(specialDefenseContainer).toHaveTextContent("LOW")

    // Speed: 101 should be HIGH (>100)
    const speedText = screen.getByText(/^speed$/i)
    const speedContainer = speedText.closest('[class*="bg-gray-50"]')
    expect(speedContainer).toHaveTextContent("HIGH")
  })

  it("handles exact threshold values correctly", () => {
    const thresholdPokemon = {
      ...mockPokemonUniqueStats,
      stats: [
        { base_stat: 60, stat: { name: "hp" } }, // LOW (exactly at threshold)
        { base_stat: 70, stat: { name: "attack" } }, // LOW (exactly at threshold)
        { base_stat: 100, stat: { name: "speed" } }, // MEDIUM (exactly at threshold)
        { base_stat: 110, stat: { name: "defense" } }, // MEDIUM (exactly at threshold)
      ],
    }

    render(<StatsTab pokemon={thresholdPokemon} isLegendary={false} />)



    // Speed: 100 should be MEDIUM (not greater than 100)
    const speedText = screen.getByText(/^speed$/i)
    const speedContainer = speedText.closest('[class*="bg-gray-50"]')
    expect(speedContainer).toHaveTextContent("MEDIUM")

    // Defense: 110 should be MEDIUM (not greater than 110)
    const defenseText = screen.getByText(/^defense$/i)
    const defenseContainer = defenseText.closest('[class*="bg-gray-50"]')
    expect(defenseContainer).toHaveTextContent("MEDIUM")
  })
})
