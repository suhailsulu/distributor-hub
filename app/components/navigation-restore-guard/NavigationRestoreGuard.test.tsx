import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NavigationRestoreGuard from "./NavigationRestoreGuard";

describe("NavigationRestoreGuard", () => {
  it("reloads the page on back/forward restore", () => {
    const reload = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { reload },
    });

    vi.spyOn(performance, "getEntriesByType").mockReturnValue([
      { type: "back_forward" } as PerformanceNavigationTiming,
    ]);

    render(<NavigationRestoreGuard />);

    window.dispatchEvent(
      new Event("pageshow", { bubbles: true }) as PageTransitionEvent,
    );

    // pageshow with persisted=false but navigation type back_forward
    const event = new Event("pageshow") as PageTransitionEvent;
    Object.defineProperty(event, "persisted", { value: false });
    window.dispatchEvent(event);

    expect(reload).toHaveBeenCalled();
  });

  it("renders nothing", () => {
    const { container } = render(<NavigationRestoreGuard />);
    expect(container).toBeEmptyDOMElement();
  });
});
