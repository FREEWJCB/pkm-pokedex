import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "../../test/utils"
import { Pagination } from "../pagination"

describe("Pagination", () => {
  const mockOnPageChange = vi.fn()

  beforeEach(() => {
    mockOnPageChange.mockClear()
    console.error = vi.fn(); 
  })

  it("does not render pagination controls when totalPages is 1 or less", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={mockOnPageChange} totalItems={5} itemsPerPage={10} />,
    )

    // Should not render pagination controls (buttons, page numbers, etc.)
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument()
    expect(screen.queryByText("Showing")).not.toBeInTheDocument()

    // The component might render an empty container, but no pagination content
    const buttons = container.querySelectorAll("button")
    expect(buttons.length).toBe(0)
  })

  it("does not render pagination controls when totalPages is 0", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={mockOnPageChange} totalItems={0} itemsPerPage={10} />,
    )

    // Should not render any pagination controls
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument()
    expect(screen.queryByText("Showing")).not.toBeInTheDocument()

    // No buttons should be present
    const buttons = container.querySelectorAll("button")
    expect(buttons.length).toBe(0)
  })

  it("renders pagination info correctly", () => {
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} totalItems={50} itemsPerPage={10} />,
    )

    expect(screen.getByText("Showing 11-20 of 50 Pokémon")).toBeInTheDocument()
  })

  it("renders page numbers", () => {
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange} totalItems={30} itemsPerPage={10} />,
    )

    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument()
  })

  it("disables previous button on first page", () => {
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange} totalItems={30} itemsPerPage={10} />,
    )

    const prevButton = screen.getByRole("button", { name: /previous/i })
    expect(prevButton).toBeDisabled()
  })

  it("disables next button on last page", () => {
    render(
      <Pagination currentPage={3} totalPages={3} onPageChange={mockOnPageChange} totalItems={30} itemsPerPage={10} />,
    )

    const nextButton = screen.getByRole("button", { name: /next/i })
    expect(nextButton).toBeDisabled()
  })

  it("calls onPageChange when page number is clicked", () => {
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange} totalItems={30} itemsPerPage={10} />,
    )

    const page2Button = screen.getByRole("button", { name: "2" })
    fireEvent.click(page2Button)

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it("calls onPageChange when next button is clicked", () => {
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange} totalItems={30} itemsPerPage={10} />,
    )

    const nextButton = screen.getByRole("button", { name: /next/i })
    fireEvent.click(nextButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it("calls onPageChange when previous button is clicked", () => {
    render(
      <Pagination currentPage={2} totalPages={3} onPageChange={mockOnPageChange} totalItems={30} itemsPerPage={10} />,
    )

    const prevButton = screen.getByRole("button", { name: /previous/i })
    fireEvent.click(prevButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(1)
  })

  it("shows ellipsis for large page counts", () => {
    render(
      <Pagination currentPage={5} totalPages={20} onPageChange={mockOnPageChange} totalItems={200} itemsPerPage={10} />,
    )

    const ellipsis = screen.getAllByText("...")
    expect(ellipsis.length).toBeGreaterThan(0)
  })

  it("shows quick jump input for large page counts", () => {
    render(
      <Pagination currentPage={5} totalPages={15} onPageChange={mockOnPageChange} totalItems={150} itemsPerPage={10} />,
    )

    expect(screen.getByText("Jump to page:")).toBeInTheDocument()
    expect(screen.getByDisplayValue("5")).toBeInTheDocument()
  })

  it("handles quick jump input change", () => {
    render(
      <Pagination currentPage={5} totalPages={15} onPageChange={mockOnPageChange} totalItems={150} itemsPerPage={10} />,
    )

    const jumpInput = screen.getByDisplayValue("5")
    fireEvent.change(jumpInput, { target: { value: "8" } })

    expect(mockOnPageChange).toHaveBeenCalledWith(8)
  })

  it("shows items per page info", () => {
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange} totalItems={30} itemsPerPage={10} />,
    )

    expect(screen.getByText("📄 10 Pokémon per page")).toBeInTheDocument()
  })

  it("handles edge case with zero items", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={mockOnPageChange} totalItems={0} itemsPerPage={10} />,
    )

    // Should not render pagination content when totalPages is 0
    expect(screen.queryByText(/showing/i)).not.toBeInTheDocument()
    expect(screen.queryByRole("button")).not.toBeInTheDocument()

    // No buttons should be present
    const buttons = container.querySelectorAll("button")
    expect(buttons.length).toBe(0)
  })

  it("calculates correct item ranges", () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} totalItems={42} itemsPerPage={10} />,
    )

    // Page 3 should show items 21-30 of 42
    expect(screen.getByText("Showing 21-30 of 42 Pokémon")).toBeInTheDocument()
  })

  it("handles last page with fewer items", () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={mockOnPageChange} totalItems={42} itemsPerPage={10} />,
    )

    // Last page should show items 41-42 of 42
    expect(screen.getByText("Showing 41-42 of 42 Pokémon")).toBeInTheDocument()
  })

  it("renders correctly when totalPages is exactly 1", () => {

    // When there's only 1 page, pagination controls should not be shown
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "1" })).not.toBeInTheDocument()

    // Should not show pagination info either
    expect(screen.queryByText(/showing/i)).not.toBeInTheDocument()
  })

  it("renders correctly when totalPages is greater than 1", () => {
    render(
      <Pagination currentPage={1} totalPages={2} onPageChange={mockOnPageChange} totalItems={15} itemsPerPage={10} />,
    )

    // When there are multiple pages, pagination controls should be shown
    expect(screen.getByRole("button", { name: /previous/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument()

    // Should show pagination info
    expect(screen.getByText("Showing 1-10 of 15 Pokémon")).toBeInTheDocument()
  })

  it("handles invalid page numbers in quick jump", () => {
    render(
      <Pagination currentPage={5} totalPages={15} onPageChange={mockOnPageChange} totalItems={150} itemsPerPage={10} />,
    )

    const jumpInput = screen.getByDisplayValue("5")

    // Test invalid values
    fireEvent.change(jumpInput, { target: { value: "0" } })
    expect(mockOnPageChange).not.toHaveBeenCalledWith(0)

    fireEvent.change(jumpInput, { target: { value: "20" } })
    expect(mockOnPageChange).not.toHaveBeenCalledWith(20)

    // Test valid value
    fireEvent.change(jumpInput, { target: { value: "10" } })
    expect(mockOnPageChange).toHaveBeenCalledWith(10)
  })

  it("shows correct page range for different scenarios", () => {
    // Test first few pages
    const { rerender } = render(
      <Pagination currentPage={1} totalPages={10} onPageChange={mockOnPageChange} totalItems={100} itemsPerPage={10} />,
    )

    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument()

    // Test middle pages
    rerender(
      <Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} totalItems={100} itemsPerPage={10} />,
    )

    expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "6" })).toBeInTheDocument()

    // Test last pages
    rerender(
      <Pagination
        currentPage={10}
        totalPages={10}
        onPageChange={mockOnPageChange}
        totalItems={100}
        itemsPerPage={10}
      />,
    )

    expect(screen.getByRole("button", { name: "9" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "10" })).toBeInTheDocument()
  })
})
