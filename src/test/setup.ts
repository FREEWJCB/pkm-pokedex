import "@testing-library/jest-dom"
import { vi } from "vitest"
import { createElement } from "react"

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: (props: any) => createElement("div", props),
    button: (props: any) => createElement("button", props),
    span: (props: any) => createElement("span", props),
    h1: (props: any) => createElement("h1", props),
    h2: (props: any) => createElement("h2", props),
    h3: (props: any) => createElement("h3", props),
    h4: (props: any) => createElement("h4", props),
    p: (props: any) => createElement("p", props),
  },
  AnimatePresence: ({ children }: { children: any }) => children,
}))

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: (props: any) =>
    createElement("img", {
      ...props,
      src: props.src || "/placeholder.svg",
    }),
}))

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

Object.defineProperty(window, "IntersectionObserver", {
  value: mockIntersectionObserver,
  writable: true,
})

// Mock window.scrollTo
Object.defineProperty(window, "scrollTo", {
  value: vi.fn(),
  writable: true,
})

// Mock fetch globally
global.fetch = vi.fn()

// Mock React 18 createRoot for compatibility
vi.mock("react-dom/client", () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
    unmount: vi.fn(),
  })),
}))
