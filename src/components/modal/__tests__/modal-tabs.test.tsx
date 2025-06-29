import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "../../../test/utils"
import { ModalTabs } from "../modal-tabs"

interface Tab {
  id: string
  label: string
  count: number
  icon: string
}

describe("ModalTabs", () => {
  const mockOnTabChange = vi.fn<(tabId: string) => void>()
  const mockTabs: Tab[] = [
    { id: "stats", label: "Base Stats", count: 6, icon: "📊" },
    { id: "abilities", label: "Abilities", count: 2, icon: "⚡" },
    { id: "moves", label: "Moves", count: 10, icon: "⚔️" },
  ]

  beforeEach(() => {
    mockOnTabChange.mockClear()
    console.error = vi.fn(); 
  })

  it("renders all tabs", () => {
    render(<ModalTabs tabs={mockTabs} activeTab="stats" onTabChange={mockOnTabChange} />)

    // Use more specific selectors to avoid duplicates
    expect(screen.getByRole("button", { name: /base stats/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /abilities/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /moves/i })).toBeInTheDocument()
  })

  it("shows tab icons and counts", () => {
    render(<ModalTabs tabs={mockTabs} activeTab="stats" onTabChange={mockOnTabChange} />)

    expect(screen.getByText("📊")).toBeInTheDocument()
    expect(screen.getByText("⚡")).toBeInTheDocument()
    expect(screen.getByText("⚔️")).toBeInTheDocument()

    // Use getAllByText and check length for counts that might appear multiple times
    const count6Elements = screen.getAllByText("6")
    expect(count6Elements.length).toBeGreaterThan(0)

    const count2Elements = screen.getAllByText("2")
    expect(count2Elements.length).toBeGreaterThan(0)

    const count10Elements = screen.getAllByText("10")
    expect(count10Elements.length).toBeGreaterThan(0)
  })

  it("highlights active tab", () => {
    render(<ModalTabs tabs={mockTabs} activeTab="stats" onTabChange={mockOnTabChange} />)

    const statsTab = screen.getByRole("button", { name: /base stats/i })
    expect(statsTab).toHaveClass("text-blue-600", "bg-white")
  })

  it("calls onTabChange when tab is clicked", () => {
    render(<ModalTabs tabs={mockTabs} activeTab="stats" onTabChange={mockOnTabChange} />)

    const abilitiesTab = screen.getByRole("button", { name: /abilities/i })
    fireEvent.click(abilitiesTab)

    expect(mockOnTabChange).toHaveBeenCalledWith("abilities")
  })

  it("shows shortened labels on mobile", () => {
    render(<ModalTabs tabs={mockTabs} activeTab="stats" onTabChange={mockOnTabChange} />)

    // Check for mobile-specific classes by looking at the tab structure
    const statsTab = screen.getByRole("button", { name: /base stats/i })
    const mobileLabel = statsTab.querySelector(".sm\\:hidden")
    expect(mobileLabel).toBeInTheDocument()
  })

  it("shows correct tab counts in badges", () => {
    render(<ModalTabs tabs={mockTabs} activeTab="stats" onTabChange={mockOnTabChange} />)

    // Find tabs by their specific button roles and check their content
    const statsTab = screen.getByRole("button", { name: /base stats/i })
    expect(statsTab).toHaveTextContent("6")

    const abilitiesTab = screen.getByRole("button", { name: /abilities/i })
    expect(abilitiesTab).toHaveTextContent("2")

    const movesTab = screen.getByRole("button", { name: /moves/i })
    expect(movesTab).toHaveTextContent("10")
  })

  it("applies correct styling to active and inactive tabs", () => {
    render(<ModalTabs tabs={mockTabs} activeTab="abilities" onTabChange={mockOnTabChange} />)

    const statsTab = screen.getByRole("button", { name: /base stats/i })
    expect(statsTab).toHaveClass("text-gray-500")

    const abilitiesTab = screen.getByRole("button", { name: /abilities/i })
    expect(abilitiesTab).toHaveClass("text-blue-600")
  })
})
