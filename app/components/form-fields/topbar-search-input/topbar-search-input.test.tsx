import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TopbarSearchInput from "./topbar-search-input";

const mockRedirect = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}));

describe("TopbarSearchInput", () => {
  it("updates the search value as the user types", async () => {
    const user = userEvent.setup();
    render(<TopbarSearchInput />);

    const input = screen.getByPlaceholderText("Search...");
    await user.type(input, "assets");
    expect(input).toHaveValue("assets");
  });

  it("redirects to search on Enter", async () => {
    const user = userEvent.setup();
    render(<TopbarSearchInput />);

    const input = screen.getByPlaceholderText("Search...");
    await user.type(input, "assets{Enter}");

    expect(mockRedirect).toHaveBeenCalledWith("/search?query=assets");
  });
});
