"use client"

import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "../../test/utils"
import { SearchBar } from "../search-bar"

describe("SearchBar", () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
    console.error = vi.fn();
  })

  it("renders with placeholder text", () => {
    render(<SearchBar value="" onChange={mockOnChange} placeholder="Search Pokemon..." />)

    expect(screen.getByPlaceholderText("Search Pokemon...")).toBeInTheDocument()
  })

  it("displays the current value", () => {
    render(<SearchBar value="pikachu" onChange={mockOnChange} placeholder="Search Pokemon..." />)

    expect(screen.getByDisplayValue("pikachu")).toBeInTheDocument()
  })

  it("calls onChange when typing", () => {
    render(<SearchBar value="" onChange={mockOnChange} placeholder="Search Pokemon..." />)

    const input = screen.getByPlaceholderText("Search Pokemon...")
    fireEvent.change(input, { target: { value: "bulbasaur" } })

    expect(mockOnChange).toHaveBeenCalledWith("bulbasaur")
  })

  it("renders search button", () => {
    render(<SearchBar value="" onChange={mockOnChange} placeholder="Search Pokemon..." />)

    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("uses default placeholder when none provided", () => {
    render(<SearchBar value="" onChange={mockOnChange} />)

    expect(screen.getByPlaceholderText("Search Pokemon...")).toBeInTheDocument()
  })
})
