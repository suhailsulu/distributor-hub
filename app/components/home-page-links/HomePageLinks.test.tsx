import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetIronSession = vi.fn();

vi.mock("iron-session", () => ({
  getIronSession: (...args: unknown[]) => mockGetIronSession(...args),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({})),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("HomePageLinks", () => {
  beforeEach(() => {
    vi.resetModules();
    mockGetIronSession.mockReset();
  });

  it("shows login and register links when logged out", async () => {
    mockGetIronSession.mockResolvedValue({
      isLoggedIn: false,
      userId: undefined,
    });

    const { default: HomePageLinks } = await import("./HomePageLinks");
    const ui = await HomePageLinks();
    render(ui);

    expect(screen.getByText("Go to Login")).toHaveAttribute("href", "/login");
    expect(screen.getByText("Request Access")).toHaveAttribute(
      "href",
      "/register",
    );
  });

  it("shows dashboard and logout links when logged in", async () => {
    mockGetIronSession.mockResolvedValue({
      isLoggedIn: true,
      userId: 42,
    });

    const { default: HomePageLinks } = await import("./HomePageLinks");
    const ui = await HomePageLinks();
    render(ui);

    expect(screen.getByText("Go to Dashboard")).toHaveAttribute(
      "href",
      "/dashboard",
    );
    expect(screen.getByText("Logout")).toHaveAttribute(
      "href",
      "/api/account/logout",
    );
  });
});
