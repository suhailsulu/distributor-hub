import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toast } from "./Toast";

describe("Toast", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the message", () => {
    render(<Toast message="Saved successfully" onClose={vi.fn()} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Saved successfully");
  });

  it("calls onClose after the duration", () => {
    vi.useFakeTimers();
    const onClose = vi.fn();

    render(<Toast message="Saved" onClose={onClose} durationMs={1000} />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
