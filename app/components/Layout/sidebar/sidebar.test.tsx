import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetIronSession = vi.fn();

vi.mock("iron-session", () => ({
  getIronSession: (...args: unknown[]) => mockGetIronSession(...args),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({})),
}));

vi.mock("../sidebar-shell", () => ({
  default: ({ email, role }: { email: string; role: string }) => (
    <div data-testid="sidebar-shell">
      {email}:{role}
    </div>
  ),
}));

describe("Sidebar", () => {
  beforeEach(() => {
    vi.resetModules();
    mockGetIronSession.mockReset();
  });

  it("returns null when logged out", async () => {
    mockGetIronSession.mockResolvedValue({
      isLoggedIn: false,
      userId: undefined,
    });

    const { default: Sidebar } = await import("./sidebar");
    const ui = await Sidebar();
    const { container } = render(<>{ui}</>);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the shell when logged in", async () => {
    mockGetIronSession.mockResolvedValue({
      isLoggedIn: true,
      userId: 1,
      email: "admin@example.com",
      role: "admin",
    });

    const { default: Sidebar } = await import("./sidebar");
    const ui = await Sidebar();
    render(ui);

    expect(screen.getByTestId("sidebar-shell")).toHaveTextContent(
      "admin@example.com:admin",
    );
  });
});
