"use client"

import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "../../test/utils"
import { PokemonCard } from "../pokemon-card"
import { mockPokemon } from "../../test/mocks/pokemon-data"

describe("PokemonCard", () => {
  const mockOnClick = vi.fn()

  beforeEach(() => {
    mockOnClick.mockClear()
    console.error = vi.fn(); 
  })

  it("renders pokemon information correctly", () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    expect(screen.getByText("bulbasaur")).toBeInTheDocument()
    expect(screen.getByText("#0001")).toBeInTheDocument()
    expect(screen.getByText("grass")).toBeInTheDocument()
    expect(screen.getByText("poison")).toBeInTheDocument()
  })

  it("displays pokemon stats", () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    // Use getAllByText to handle multiple elements with the same text
    const hpElements = screen.getAllByText("45") // HP stat
    expect(hpElements.length).toBeGreaterThan(0)

    const attackDefenseElements = screen.getAllByText("49") // Attack and Defense stats
    expect(attackDefenseElements.length).toBeGreaterThanOrEqual(2) // Should have at least 2 (attack and defense)

    // Verify the stats are displayed in the context of the card
    expect(screen.getByText("HP")).toBeInTheDocument()
    expect(screen.getByText("ATK")).toBeInTheDocument()
    expect(screen.getByText("DEF")).toBeInTheDocument()
  })

  it("calls onClick when card is clicked", () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    // Find the card container and click it
    const cardContainer =
      screen.getByText("bulbasaur").closest('[role="button"]') ||
      screen.getByText("bulbasaur").closest('div[class*="cursor-pointer"]')

    if (cardContainer) {
      fireEvent.click(cardContainer)
      expect(mockOnClick).toHaveBeenCalledWith(mockPokemon)
    } else {
      // Fallback: click on the pokemon name
      fireEvent.click(screen.getByText("bulbasaur"))
      expect(mockOnClick).toHaveBeenCalledWith(mockPokemon)
    }
  })

  it("renders pokemon image with correct alt text", () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    const image = screen.getByAltText("bulbasaur")
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", expect.stringContaining("bulbasaur-artwork.png"))
  })

  it("shows shiny indicator for special pokemon (id divisible by 100)", () => {
    const shinyPokemon = { ...mockPokemon, id: 100 }
    render(<PokemonCard pokemon={shinyPokemon} onClick={mockOnClick} />)

    expect(screen.getByText("✨")).toBeInTheDocument()
  })

  it("shows legendary indicator for high stat total pokemon", () => {
    const legendaryPokemon = {
      ...mockPokemon,
      stats: [
        { base_stat: 150, stat: { name: "hp" } },
        { base_stat: 150, stat: { name: "attack" } },
        { base_stat: 150, stat: { name: "defense" } },
        { base_stat: 150, stat: { name: "special-attack" } },
        { base_stat: 150, stat: { name: "special-defense" } },
        { base_stat: 150, stat: { name: "speed" } },
      ],
    }

    const { container } = render(<PokemonCard pokemon={legendaryPokemon} onClick={mockOnClick} />)

    // Should have legendary styling (ring classes)
    const cardElement = container.querySelector('[class*="ring-2"]')
    expect(cardElement).toBeInTheDocument()
  })

  it("handles missing onClick gracefully", () => {
    expect(() => {
      render(<PokemonCard pokemon={mockPokemon} />)
    }).not.toThrow()
  })

  it("handles image loading error", () => {
    const pokemonWithBadImage = {
      ...mockPokemon,
      sprites: {
        front_default: "",
        other: {
          "official-artwork": {
            front_default: "",
          },
        },
      },
    }

    expect(() => {
      render(<PokemonCard pokemon={pokemonWithBadImage} onClick={mockOnClick} />)
    }).not.toThrow()
  })

  it("displays individual stat values correctly", () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    // Check for stat labels to ensure we're in the right context
    expect(screen.getByText("HP")).toBeInTheDocument()
    expect(screen.getByText("ATK")).toBeInTheDocument()
    expect(screen.getByText("DEF")).toBeInTheDocument()

    // Strategy 1: Look for the stats container that has both label and value
    const { container } = render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    // Find all stat containers (should be in a grid with bg-gray-50 class)
    const statContainers = container.querySelectorAll('[class*="bg-gray-50"]')

    // Verify we have 3 stat containers
    expect(statContainers.length).toBe(3)

    // Check that each container has both label and value
    let foundHP = false
    let foundATK = false
    let foundDEF = false

    statContainers.forEach((container) => {
      const text = container.textContent || ""
      if (text.includes("HP") && text.includes("45")) {
        foundHP = true
      }
      if (text.includes("ATK") && text.includes("49")) {
        foundATK = true
      }
      if (text.includes("DEF") && text.includes("49")) {
        foundDEF = true
      }
    })

    expect(foundHP).toBe(true)
    expect(foundATK).toBe(true)
    expect(foundDEF).toBe(true)
  })

  it("displays stats with correct structure", () => {
    const { container } = render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    // Look for the stats grid container
    const statsGrid = container.querySelector('[class*="grid-cols-3"]')
    expect(statsGrid).toBeInTheDocument()

    // Verify it contains the expected stats
    expect(statsGrid).toHaveTextContent("HP")
    expect(statsGrid).toHaveTextContent("ATK")
    expect(statsGrid).toHaveTextContent("DEF")
    expect(statsGrid).toHaveTextContent("45") // HP value
    expect(statsGrid).toHaveTextContent("49") // ATK/DEF value
  })

  it("renders pokemon types correctly", () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    // Verify both types are displayed
    const grassType = screen.getByText("grass")
    const poisonType = screen.getByText("poison")

    expect(grassType).toBeInTheDocument()
    expect(poisonType).toBeInTheDocument()

    // Verify they have the correct styling (should be in spans with background colors)
    expect(grassType.closest("span")).toBeInTheDocument()
    expect(poisonType.closest("span")).toBeInTheDocument()
  })

  it("displays pokemon ID with correct formatting", () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    // Should display ID with leading zeros
    expect(screen.getByText("#0001")).toBeInTheDocument()
  })

  it("handles pokemon with different stats", () => {
    const differentStatsPokemon = {
      ...mockPokemon,
      id: 25,
      name: "pikachu",
      stats: [
        { base_stat: 35, stat: { name: "hp" } },
        { base_stat: 55, stat: { name: "attack" } },
        { base_stat: 40, stat: { name: "defense" } },
        { base_stat: 50, stat: { name: "special-attack" } },
        { base_stat: 50, stat: { name: "special-defense" } },
        { base_stat: 90, stat: { name: "speed" } },
      ],
    }

    render(<PokemonCard pokemon={differentStatsPokemon} onClick={mockOnClick} />)

    // Check for unique stat values
    expect(screen.getByText("35")).toBeInTheDocument() // HP
    expect(screen.getByText("55")).toBeInTheDocument() // Attack
    expect(screen.getByText("40")).toBeInTheDocument() // Defense
  })

  it("renders card with proper interactive elements", () => {
    const { container } = render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    // Should have cursor-pointer class for interactivity
    const clickableElement = container.querySelector('[class*="cursor-pointer"]')
    expect(clickableElement).toBeInTheDocument()

    // Should have proper hover states
    const cardElement = container.querySelector('[class*="hover:shadow"]')
    expect(cardElement).toBeInTheDocument()
  })

  it("handles pokemon with single type", () => {
    const singleTypePokemon = {
      ...mockPokemon,
      types: [{ type: { name: "electric" } }],
    }

    render(<PokemonCard pokemon={singleTypePokemon} onClick={mockOnClick} />)

    expect(screen.getByText("electric")).toBeInTheDocument()
    expect(screen.queryByText("poison")).not.toBeInTheDocument()
  })

  it("displays pokemon name with correct capitalization", () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    // Pokemon name should be displayed (component handles capitalization)
    const nameElement = screen.getByText("bulbasaur")
    expect(nameElement).toBeInTheDocument()
    expect(nameElement).toHaveClass("capitalize")
  })

  it("shows correct stat layout", () => {
    const { container } = render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    // Should have a grid layout for stats
    const statsGrid = container.querySelector('[class*="grid-cols-3"]')
    expect(statsGrid).toBeInTheDocument()

    // Should have three stat columns
    const statColumns = container.querySelectorAll('[class*="grid-cols-3"] > div')
    expect(statColumns.length).toBe(3)
  })

  it("verifies stat values are present in component", () => {
    const { container } = render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    // Simple verification that all expected values are somewhere in the component
    const componentText = container.textContent || ""

    // Check that all expected stat values are present
    expect(componentText).toContain("45") // HP
    expect(componentText).toContain("49") // Attack/Defense
    expect(componentText).toContain("HP")
    expect(componentText).toContain("ATK")
    expect(componentText).toContain("DEF")
  })
})
