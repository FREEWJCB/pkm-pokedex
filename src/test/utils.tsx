import type React from "react"
import { render, type RenderOptions } from "@testing-library/react"
import { renderHook, act } from "@testing-library/react"

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  wrapper?: React.ComponentType<{ children: React.ReactNode }>
}

// Custom render function that includes providers if needed
const customRender = (ui: React.ReactElement, options?: CustomRenderOptions) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <div>{children}</div>
  }

  return render(ui, {
    wrapper: options?.wrapper || Wrapper,
    ...options,
  })
}

export * from "@testing-library/react"
export { customRender as render }

// Re-export renderHook and act from the correct package
export { renderHook, act as hookAct }
export type { RenderHookOptions, RenderHookResult } from "@testing-library/react"
