import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetIronSession = vi.fn();

vi.mock("iron-session", () => ({
  getIronSession: (...args: unknown[]) => mockGetIronSession(...args),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({})),
}));

vi.mock("../topbar-links", () => ({
  default: () => <div data-testid="topbar-links" />,
}));

vi.mock("../../form-fields/topbar-search-input", () => ({
  default: () => <div data-testid="topbar-search" />,
}));

describe("Topbar", () => {
  beforeEach(() => {
    vi.resetModules();
    mockGetIronSession.mockReset();
  });

  it("returns null when logged out", async () => {
    mockGetIronSession.mockResolvedValue({
      isLoggedIn: false,
      userId: undefined,
    });

    const { default: Topbar } = await import("./topbar");
    const ui = await Topbar();
    const { container } = render(<>{ui}</>);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders welcome text and child widgets when logged in", async () => {
    mockGetIronSession.mockResolvedValue({
      isLoggedIn: true,
      userId: 1,
      email: "user@example.com",
    });

    const { default: Topbar } = await import("./topbar");
    const ui = await Topbar();
    render(ui);

    expect(screen.getByText("Welcome, user@example.com")).toBeInTheDocument();
    expect(screen.getByTestId("topbar-links")).toBeInTheDocument();
    expect(screen.getByTestId("topbar-search")).toBeInTheDocument();
  });
});
