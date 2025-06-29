import { describe, it, expect } from "vitest"
import { render, screen } from "../../test/utils"
import { LoadingSpinner } from "../loading-spinner"

describe("LoadingSpinner", () => {
  it("renders with default message", () => {
    render(<LoadingSpinner />)

    expect(screen.getByText("Loading Pokémon...")).toBeInTheDocument()
  })

  it("renders with custom message", () => {
    render(<LoadingSpinner message="Loading data..." />)

    expect(screen.getByText("Loading data...")).toBeInTheDocument()
  })

  it("shows progress when enabled", () => {
    render(<LoadingSpinner message="Loading..." showProgress={true} current={5} total={10} />)

    expect(screen.getByText("5 / 10 Pokémon loaded")).toBeInTheDocument()
    expect(screen.getByText("50.0%")).toBeInTheDocument()
  })

  it("does not show progress when disabled", () => {
    render(<LoadingSpinner message="Loading..." showProgress={false} current={5} total={10} />)

    expect(screen.queryByText("5 / 10 Pokémon loaded")).not.toBeInTheDocument()
  })

  it("shows API info when progress is enabled", () => {
    render(<LoadingSpinner showProgress={true} current={1} total={10} />)

    expect(screen.getByText("📋 Using PokeAPI list endpoint for efficient loading")).toBeInTheDocument()
  })

  it("calculates percentage correctly", () => {
    render(<LoadingSpinner showProgress={true} current={3} total={4} />)

    expect(screen.getByText("75.0%")).toBeInTheDocument()
  })

  it("handles zero total gracefully", () => {
    render(<LoadingSpinner showProgress={true} current={0} total={0} />)

    // When total is 0, the progress section should still show
    expect(screen.getByText("0 / 0 Pokémon loaded")).toBeInTheDocument()
    expect(screen.getByTestId("percentage-display")).toHaveTextContent("0.0%")
  })

  it("shows loading animation elements", () => {
    const { container } = render(<LoadingSpinner />)

    // Check for pokeball spinner using the specific class we added
    const spinner = container.querySelector(".pokeball-spinner")
    expect(spinner).toBeInTheDocument()
  })

  it("shows progress bar when progress is enabled", () => {
    const { container } = render(<LoadingSpinner showProgress={true} current={5} total={10} />)

    // Check for progress bar
    const progressBar = container.querySelector('[class*="bg-gray-700"]')
    expect(progressBar).toBeInTheDocument()
  })

  it("handles undefined props gracefully", () => {
    expect(() => {
      render(<LoadingSpinner showProgress={true} />)
    }).not.toThrow()
  })

  it("shows floating particles", () => {
    const { container } = render(<LoadingSpinner showProgress={true} current={1} total={10} />)

    // Check for particle elements
    const particles = container.querySelectorAll('[class*="bg-blue-400"]')
    expect(particles.length).toBeGreaterThan(0)
  })

  it("renders pokeball spinner structure", () => {
    const { container } = render(<LoadingSpinner />)

    // Check for the pokeball structure
    const pokeball = container.querySelector(".pokeball-spinner")
    expect(pokeball).toBeInTheDocument()

    // Check for the pokeball design elements within the spinner
    const pokeballDesign = pokeball?.querySelector('[class*="from-red-500"]')
    expect(pokeballDesign).toBeInTheDocument()
  })

  it("shows progress stats correctly", () => {
    render(<LoadingSpinner showProgress={true} current={7} total={15} />)

    expect(screen.getByText("7 / 15 Pokémon loaded")).toBeInTheDocument()
    expect(screen.getByText("46.7%")).toBeInTheDocument()
  })

  it("shows loading phase indicators", () => {
    // Test different loading phases
    render(<LoadingSpinner showProgress={true} current={0} total={0} />)
    expect(screen.getByText("Initializing...")).toBeInTheDocument()

    // Re-render with different state
    const { rerender } = render(<LoadingSpinner showProgress={true} current={0} total={10} />)
    expect(screen.getByText("Fetching Pokemon list...")).toBeInTheDocument()

    // Re-render with progress
    rerender(<LoadingSpinner showProgress={true} current={5} total={10} />)
    expect(screen.getByText("Loading Pokemon details...")).toBeInTheDocument()

    // Re-render when complete
    rerender(<LoadingSpinner showProgress={true} current={10} total={10} />)
    expect(screen.getByText("Finalizing...")).toBeInTheDocument()
  })

  it("shows loading tips when total is greater than zero", () => {
    render(<LoadingSpinner showProgress={true} current={1} total={5} />)

    // Check for the actual text that exists in the component
    expect(
      screen.getByText(/First fetching Pokemon list, then loading individual details in batches!/i),
    ).toBeInTheDocument()
  })

  it("does not show loading tips when total is zero", () => {
    render(<LoadingSpinner showProgress={true} current={0} total={0} />)

    // Loading tips should not appear when total is 0
    expect(
      screen.queryByText(/First fetching Pokemon list, then loading individual details in batches!/i),
    ).not.toBeInTheDocument()
  })

  it("shows process information when progress is enabled", () => {
    render(<LoadingSpinner showProgress={true} current={1} total={5} />)

    expect(screen.getByText("Process:")).toBeInTheDocument()
    expect(
      screen.getByText(/First fetching Pokemon list, then loading individual details in batches!/i),
    ).toBeInTheDocument()
  })

  it("shows correct loading phases based on progress", () => {
    const { rerender } = render(<LoadingSpinner showProgress={true} current={0} total={0} />)

    // Phase 1: Initializing
    expect(screen.getByText("Initializing...")).toBeInTheDocument()

    // Phase 2: Fetching list
    rerender(<LoadingSpinner showProgress={true} current={0} total={10} />)
    expect(screen.getByText("Fetching Pokemon list...")).toBeInTheDocument()

    // Phase 3: Loading details
    rerender(<LoadingSpinner showProgress={true} current={3} total={10} />)
    expect(screen.getByText("Loading Pokemon details...")).toBeInTheDocument()

    // Phase 4: Finalizing
    rerender(<LoadingSpinner showProgress={true} current={10} total={10} />)
    expect(screen.getByText("Finalizing...")).toBeInTheDocument()
  })

  it("shows shimmer effect on progress bar", () => {
    const { container } = render(<LoadingSpinner showProgress={true} current={5} total={10} />)

    // Check for shimmer effect classes
    const shimmer = container.querySelector('[class*="from-transparent"][class*="via-white"][class*="to-transparent"]')
    expect(shimmer).toBeInTheDocument()
  })

  it("shows animated progress counters", () => {
    render(<LoadingSpinner showProgress={true} current={5} total={10} />)

    // The counters should be present and animated (we can't test animation directly, but we can test presence)
    expect(screen.getByText("5 / 10 Pokémon loaded")).toBeInTheDocument()
    expect(screen.getByText("50.0%")).toBeInTheDocument()
  })

  it("shows gradient progress bar", () => {
    const { container } = render(<LoadingSpinner showProgress={true} current={5} total={10} />)

    // Check for gradient background on progress bar
    const progressBar = container.querySelector('[style*="linear-gradient"]')
    expect(progressBar).toBeInTheDocument()
  })

  it("shows pokeball center animation", () => {
    const { container } = render(<LoadingSpinner />)

    // Check for the animated center dot of the pokeball
    const centerDot = container.querySelector('.pokeball-spinner [class*="bg-gray-800"][class*="rounded-full"]')
    expect(centerDot).toBeInTheDocument()
  })

  it("displays correct message for different loading states", () => {
    // Test custom message
    render(<LoadingSpinner message="Custom loading message" />)
    expect(screen.getByText("Custom loading message")).toBeInTheDocument()

    // Test default message
    const { rerender } = render(<LoadingSpinner />)
    console.log(rerender)
    expect(screen.getByText("Loading Pokémon...")).toBeInTheDocument()
  })
})
