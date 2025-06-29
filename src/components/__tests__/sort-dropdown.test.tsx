import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "../../test/utils"
import { SortDropdown } from "../sort-dropdown"
import type { FilterOptions } from "../../types/pokemon"

describe("SortDropdown", () => {
  const mockOnFiltersChange = vi.fn()
  const defaultFilters: FilterOptions = {
    search: "",
    type: "",
    sortBy: "id",
    sortOrder: "asc",
    region: "kanto",
  }

  beforeEach(() => {
    mockOnFiltersChange.mockClear()
    console.error = vi.fn()
  })

  it("renders sort label and dropdown", () => {
    render(<SortDropdown filters={defaultFilters} onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByText("Sort By")).toBeInTheDocument()
    expect(screen.getByRole("combobox")).toBeInTheDocument()
  })

  it("shows current sort option", () => {
    render(<SortDropdown filters={defaultFilters} onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByDisplayValue("🔢 Lowest Number (First)")).toBeInTheDocument()
  })

  it("calls onFiltersChange when sort option changes", () => {
    render(<SortDropdown filters={defaultFilters} onFiltersChange={mockOnFiltersChange} />)

    const select = screen.getByRole("combobox")
    fireEvent.change(select, { target: { value: "name-asc" } })

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      sortBy: "name",
      sortOrder: "asc",
    })
  })

  it("displays all sort options", () => {
    render(<SortDropdown filters={defaultFilters} onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByText("🔢 Lowest Number (First)")).toBeInTheDocument()
    expect(screen.getByText("🔢 Highest Number (First)")).toBeInTheDocument()
    expect(screen.getByText("🔢 A-Z")).toBeInTheDocument()
    expect(screen.getByText("🔢 Z-A")).toBeInTheDocument()
  })

  it("handles different sort combinations", () => {
    const filters = { ...defaultFilters, sortBy: "name" as const, sortOrder: "desc" as const }

    render(<SortDropdown filters={filters} onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByDisplayValue("🔢 Z-A")).toBeInTheDocument()
  })
})
