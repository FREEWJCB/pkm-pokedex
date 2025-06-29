"use client"

import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "../../../test/utils"
import { ModalHeader } from "../modal-header"
import { mockPokemon } from "../../../test/mocks/pokemon-data"

describe("ModalHeader", () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
    console.error = vi.fn(); 
  })

  it("renders pokemon information correctly", () => {
    console.log('hola');
    render(<ModalHeader pokemon={mockPokemon} onClose={mockOnClose} isLegendary={false} />)

    expect(screen.getByText("bulbasaur")).toBeInTheDocument()
    expect(screen.getByText("#0001")).toBeInTheDocument()
    expect(screen.getByText("grass")).toBeInTheDocument()
    expect(screen.getByText("poison")).toBeInTheDocument()
  })

  it("shows legendary badge when isLegendary is true", () => {
    render(<ModalHeader pokemon={mockPokemon} onClose={mockOnClose} isLegendary={true} />)

    expect(screen.getByText("✨ LEGENDARY")).toBeInTheDocument()
  })

  it("displays pokemon stats correctly", () => {
    render(<ModalHeader pokemon={mockPokemon} onClose={mockOnClose} isLegendary={false} />)

    expect(screen.getByText("0.7m")).toBeInTheDocument() // Height
    expect(screen.getByText("6.9kg")).toBeInTheDocument() // Weight
    expect(screen.getByText("64")).toBeInTheDocument() // Base experience
  })

  it("calls onClose when close button is clicked", () => {
    render(<ModalHeader pokemon={mockPokemon} onClose={mockOnClose} isLegendary={false} />)

    const closeButton = screen.getByLabelText("Close modal")
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it("renders pokemon image with correct alt text", () => {
    render(<ModalHeader pokemon={mockPokemon} onClose={mockOnClose} isLegendary={false} />)

    const image = screen.getByAltText("bulbasaur")
    expect(image).toBeInTheDocument()
  })

  it("shows generation correctly", () => {
    render(<ModalHeader pokemon={mockPokemon} onClose={mockOnClose} isLegendary={false} />)

    expect(screen.getByText("I")).toBeInTheDocument() // Generation 1
  })
})
