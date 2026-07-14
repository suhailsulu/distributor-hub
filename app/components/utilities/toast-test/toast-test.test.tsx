import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ToastTest from "./toast-test";

describe("ToastTest", () => {
  it("shows a toast when the button is clicked", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<ToastTest />);

    await user.click(screen.getByRole("button", { name: "Show Toast" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "This is a toast message!",
    );

    vi.useRealTimers();
  });
});
