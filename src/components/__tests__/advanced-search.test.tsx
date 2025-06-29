import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "../../test/utils"
import { AdvancedSearch } from "../advanced-search"
import type { FilterOptions } from "../../types/pokemon"

describe("AdvancedSearch", () => {
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
    console.error = vi.fn(); 
  })

  it("renders toggle button", () => {
    render(<AdvancedSearch filters={defaultFilters} onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByText("Show Advanced Search")).toBeInTheDocument()
  })

  it("expands when toggle button is clicked", () => {
    render(<AdvancedSearch filters={defaultFilters} onFiltersChange={mockOnFiltersChange} />)

    const toggleButton = screen.getByText("Show Advanced Search")
    fireEvent.click(toggleButton)

    expect(screen.getByText("Primary Type")).toBeInTheDocument()
    expect(screen.getByText("Secondary Type")).toBeInTheDocument()
    expect(screen.getByText("Type Count")).toBeInTheDocument()
  })

  it("shows filter options when expanded", () => {
    render(<AdvancedSearch filters={defaultFilters} onFiltersChange={mockOnFiltersChange} />)

    // Expand the search
    fireEvent.click(screen.getByText("Show Advanced Search"))

    expect(screen.getByText("Height")).toBeInTheDocument()
    expect(screen.getByText("Weight")).toBeInTheDocument()
    expect(screen.getByText("Popular Type Combinations:")).toBeInTheDocument()
  })

  it("calls onFiltersChange when primary type is selected", () => {
    render(<AdvancedSearch filters={defaultFilters} onFiltersChange={mockOnFiltersChange} />)

    // Expand the search
    fireEvent.click(screen.getByText("Show Advanced Search"))

    const primaryTypeSelect = screen.getByLabelText("Primary Type")
    fireEvent.change(primaryTypeSelect, { target: { value: "fire" } })

    expect(mockOnFiltersChange).toHaveBeenCalledWith({ type: "fire" })
  })

  it("calls onFiltersChange when secondary type is selected", () => {
    render(<AdvancedSearch filters={defaultFilters} onFiltersChange={mockOnFiltersChange} />)

    // Expand the search
    fireEvent.click(screen.getByText("Show Advanced Search"))

    const secondaryTypeSelect = screen.getByLabelText("Secondary Type")
    fireEvent.change(secondaryTypeSelect, { target: { value: "flying" } })

    expect(mockOnFiltersChange).toHaveBeenCalledWith({ secondaryType: "flying" })
  })

  it("shows popular type combination buttons", () => {
    render(<AdvancedSearch filters={defaultFilters} onFiltersChange={mockOnFiltersChange} />)

    // Expand the search
    fireEvent.click(screen.getByText("Show Advanced Search"))

    expect(screen.getByText("Fire/Flying")).toBeInTheDocument()
    expect(screen.getByText("Water/Ground")).toBeInTheDocument()
    expect(screen.getByText("Grass/Poison")).toBeInTheDocument()
  })

  it("applies type combination when button is clicked", () => {
    render(<AdvancedSearch filters={defaultFilters} onFiltersChange={mockOnFiltersChange} />)

    // Expand the search
    fireEvent.click(screen.getByText("Show Advanced Search"))

    const fireFlying = screen.getByText("Fire/Flying")
    fireEvent.click(fireFlying)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      type: "fire",
      secondaryType: "flying",
    })
  })

  it("handles height range selection", () => {
    render(<AdvancedSearch filters={defaultFilters} onFiltersChange={mockOnFiltersChange} />)

    // Expand the search
    fireEvent.click(screen.getByText("Show Advanced Search"))

    const heightSelect = screen.getByLabelText("Height")
    fireEvent.change(heightSelect, { target: { value: "tall" } })

    expect(mockOnFiltersChange).toHaveBeenCalledWith({ heightRange: "tall" })
  })

  it("handles weight range selection", () => {
    render(<AdvancedSearch filters={defaultFilters} onFiltersChange={mockOnFiltersChange} />)

    // Expand the search
    fireEvent.click(screen.getByText("Show Advanced Search"))

    const weightSelect = screen.getByLabelText("Weight")
    fireEvent.change(weightSelect, { target: { value: "heavy" } })

    expect(mockOnFiltersChange).toHaveBeenCalledWith({ weightRange: "heavy" })
  })

  it("handles type count selection", () => {
    render(<AdvancedSearch filters={defaultFilters} onFiltersChange={mockOnFiltersChange} />)

    // Expand the search
    fireEvent.click(screen.getByText("Show Advanced Search"))

    const typeCountSelect = screen.getByLabelText("Type Count")
    fireEvent.change(typeCountSelect, { target: { value: "dual" } })

    expect(mockOnFiltersChange).toHaveBeenCalledWith({ dualType: "dual" })
  })

  it("shows all dual types button", () => {
    render(<AdvancedSearch filters={defaultFilters} onFiltersChange={mockOnFiltersChange} />)

    // Expand the search
    fireEvent.click(screen.getByText("Show Advanced Search"))

    const allDualTypesButton = screen.getByText("All Dual Types")
    fireEvent.click(allDualTypesButton)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      type: "",
      secondaryType: "",
      dualType: "dual",
    })
  })

  it("collapses when toggle button is clicked again", () => {
    render(<AdvancedSearch filters={defaultFilters} onFiltersChange={mockOnFiltersChange} />)

    const toggleButton = screen.getByText("Show Advanced Search")

    // Expand
    fireEvent.click(toggleButton)
    expect(screen.getByText("Primary Type")).toBeInTheDocument()

    // Collapse
    fireEvent.click(toggleButton)
    expect(screen.queryByText("Primary Type")).not.toBeInTheDocument()
  })
})
