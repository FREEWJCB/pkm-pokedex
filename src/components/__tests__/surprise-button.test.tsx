import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent } from "../../test/utils"
import { SurpriseButton } from "../surprise-button"
import { mockPokemonList } from "../../test/mocks/pokemon-data"

describe("SurpriseButton", () => {
  const mockOnPokemonSelect = vi.fn()

  beforeEach(() => {
    mockOnPokemonSelect.mockClear()
    // Mock Math.random to make tests deterministic
    vi.spyOn(Math, "random").mockReturnValue(0.5)
    console.error = vi.fn(); 
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders button with correct text and icon", () => {
    render(<SurpriseButton pokemonList={mockPokemonList} onPokemonSelect={mockOnPokemonSelect} />)

    expect(screen.getByRole("button", { name: /surprise me!/i })).toBeInTheDocument()
    expect(screen.getByText("🎲")).toBeInTheDocument()
    expect(screen.getByText("Surprise Me!")).toBeInTheDocument()
  })

  it("calls onPokemonSelect with random pokemon when clicked", () => {
    render(<SurpriseButton pokemonList={mockPokemonList} onPokemonSelect={mockOnPokemonSelect} />)

    const button = screen.getByRole("button", { name: /surprise me!/i })
    fireEvent.click(button)

    expect(mockOnPokemonSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
      }),
    )
  })

  it("does not call onPokemonSelect when pokemon list is empty", () => {
    render(<SurpriseButton pokemonList={[]} onPokemonSelect={mockOnPokemonSelect} />)

    const button = screen.getByRole("button", { name: /surprise me!/i })
    fireEvent.click(button)

    expect(mockOnPokemonSelect).not.toHaveBeenCalled()
  })

  it("selects pokemon based on Math.random", () => {
    // Mock Math.random to return 0 (first pokemon)
    vi.spyOn(Math, "random").mockReturnValue(0)

    render(<SurpriseButton pokemonList={mockPokemonList} onPokemonSelect={mockOnPokemonSelect} />)

    const button = screen.getByRole("button", { name: /surprise me!/i })
    fireEvent.click(button)

    expect(mockOnPokemonSelect).toHaveBeenCalledWith(mockPokemonList[0])
  })
})
