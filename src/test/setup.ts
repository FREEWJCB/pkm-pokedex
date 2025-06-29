import React from "react"
import { beforeAll, vi } from "vitest"
import "@testing-library/jest-dom"

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: (props: React.ComponentProps<"div">) => React.createElement("div", props),
    button: (props: React.ComponentProps<"button">) => React.createElement("button", props),
    span: (props: React.ComponentProps<"span">) => React.createElement("span", props),
    h1: (props: React.ComponentProps<"h1">) => React.createElement("h1", props),
    h2: (props: React.ComponentProps<"h2">) => React.createElement("h2", props),
    h3: (props: React.ComponentProps<"h3">) => React.createElement("h3", props),
    p: (props: React.ComponentProps<"p">) => React.createElement("p", props),
    input: (props: React.ComponentProps<"input">) => React.createElement("input", props),
    select: (props: React.ComponentProps<"select">) => React.createElement("select", props),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  }),
}))

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: (props: React.ComponentProps<"img">) => React.createElement("img", props),
}))

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
    getAll: vi.fn(),
    has: vi.fn(),
    keys: vi.fn(),
    values: vi.fn(),
    entries: vi.fn(),
    forEach: vi.fn(),
    toString: vi.fn(),
  }),
  usePathname: () => "/",
}))

// Setup global test environment
beforeAll(() => {
  // Mock window.matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
})
