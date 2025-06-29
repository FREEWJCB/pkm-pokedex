import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "../../test/utils"
import { RegionNavigation } from "../region-navigation"

describe("RegionNavigation", () => {
  const mockOnRegionChange = vi.fn()
  beforeEach(() => {
    mockOnRegionChange.mockClear()
    console.error = vi.fn();
  })

  it("renders title and description", () => {
    render(<RegionNavigation activeRegion="kanto" onRegionChange={mockOnRegionChange} />)

    expect(screen.getByText("Pokédex Regional")).toBeInTheDocument()
    expect(screen.getByText("Explora Pokémon por región")).toBeInTheDocument()
  })

  it("renders all regions", () => {
    render(<RegionNavigation activeRegion="kanto" onRegionChange={mockOnRegionChange} />)

    expect(screen.getByText("Kanto")).toBeInTheDocument()
    expect(screen.getByText("Johto")).toBeInTheDocument()
    expect(screen.getByText("Hoenn")).toBeInTheDocument()
    expect(screen.getByText("Sinnoh")).toBeInTheDocument()
    expect(screen.getByText("Unova")).toBeInTheDocument()
    expect(screen.getByText("Kalos")).toBeInTheDocument()
    expect(screen.getByText("Alola")).toBeInTheDocument()
    expect(screen.getByText("Galar")).toBeInTheDocument()
    expect(screen.getByText("Paldea")).toBeInTheDocument()
  })

  it("highlights active region", () => {
    render(<RegionNavigation activeRegion="kanto" onRegionChange={mockOnRegionChange} />)

    const kantoButton = screen.getByRole("button", { name: /kanto/i })
    expect(kantoButton).toHaveClass("bg-red-500")
    expect(kantoButton).toHaveClass("text-white")
  })

  it("calls onRegionChange when region is clicked", () => {
    render(<RegionNavigation activeRegion="kanto" onRegionChange={mockOnRegionChange} />)

    const johtoButton = screen.getByRole("button", { name: /johto/i })
    fireEvent.click(johtoButton)

    expect(mockOnRegionChange).toHaveBeenCalledWith("johto")
  })

  it("shows generation numbers for each region", () => {
    render(<RegionNavigation activeRegion="kanto" onRegionChange={mockOnRegionChange} />)

    expect(screen.getByText("Gen 1")).toBeInTheDocument()
    expect(screen.getByText("Gen 2")).toBeInTheDocument()
    expect(screen.getByText("Gen 3")).toBeInTheDocument()
  })

  it("shows pokemon ID ranges for each region", () => {
    render(<RegionNavigation activeRegion="kanto" onRegionChange={mockOnRegionChange} />)

    expect(screen.getByText("#1-151")).toBeInTheDocument()
    expect(screen.getByText("#152-251")).toBeInTheDocument()
    expect(screen.getByText("#252-386")).toBeInTheDocument()
  })

  it("handles region change correctly", () => {
    const { rerender } = render(<RegionNavigation activeRegion="kanto" onRegionChange={mockOnRegionChange} />)

    // Initially Kanto should be active
    const kantoButton = screen.getByRole("button", { name: /kanto/i })
    expect(kantoButton).toHaveClass("bg-red-500")

    // Re-render with different active region
    rerender(<RegionNavigation activeRegion="johto" onRegionChange={mockOnRegionChange} />)

    // Now Johto should be active
    const johtoButton = screen.getByRole("button", { name: /johto/i })
    expect(johtoButton).toHaveClass("bg-red-500")
  })
})
