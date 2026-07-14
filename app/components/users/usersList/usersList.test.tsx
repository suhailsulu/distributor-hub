import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetIronSession = vi.fn();
const mockGetUsers = vi.fn();
const mockRedirect = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});

vi.mock("iron-session", () => ({
  getIronSession: (...args: unknown[]) => mockGetIronSession(...args),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({})),
}));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => mockRedirect(url),
}));

vi.mock("@/app/lib/usermanagement", () => ({
  getUsers: (...args: unknown[]) => mockGetUsers(...args),
  partitionUsers: (users: Array<{ user_status: string }>) => ({
    newUsers: users.filter((user) =>
      ["unverified", "pending"].includes(user.user_status),
    ),
    existingUsers: users.filter((user) =>
      ["active", "inactive", "suspended"].includes(user.user_status),
    ),
  }),
}));

vi.mock("../existingUsers", () => ({
  default: ({ users }: { users: unknown[] }) => (
    <div data-testid="existing-users">{users.length}</div>
  ),
}));

vi.mock("../newUsers", () => ({
  default: ({ users }: { users: unknown[] }) => (
    <div data-testid="new-users">{users.length}</div>
  ),
}));

describe("UsersList", () => {
  beforeEach(() => {
    vi.resetModules();
    mockGetIronSession.mockReset();
    mockGetUsers.mockReset();
    mockRedirect.mockClear();
  });

  it("redirects unauthenticated users to login", async () => {
    mockGetIronSession.mockResolvedValue({
      isLoggedIn: false,
      userId: undefined,
    });

    const { default: UsersList } = await import("./usersList");

    await expect(UsersList()).rejects.toThrow(
      "NEXT_REDIRECT:/login?returnUrl=%2Fadmin%2Fusers",
    );
  });

  it("redirects non-admin users to dashboard", async () => {
    mockGetIronSession.mockResolvedValue({
      isLoggedIn: true,
      userId: 1,
      role: "user",
    });

    const { default: UsersList } = await import("./usersList");

    await expect(UsersList()).rejects.toThrow("NEXT_REDIRECT:/dashboard");
  });

  it("renders partitioned users for admins", async () => {
    mockGetIronSession.mockResolvedValue({
      isLoggedIn: true,
      userId: 1,
      role: "admin",
    });
    mockGetUsers.mockResolvedValue([
      { id: 1, user_status: "pending" },
      { id: 2, user_status: "active" },
    ]);

    const { default: UsersList } = await import("./usersList");
    const ui = await UsersList();
    render(ui);

    expect(screen.getByText("Users List")).toBeInTheDocument();
    expect(screen.getByTestId("new-users")).toHaveTextContent("1");
    expect(screen.getByTestId("existing-users")).toHaveTextContent("1");
  });

  it("shows an error state when users cannot be loaded", async () => {
    mockGetIronSession.mockResolvedValue({
      isLoggedIn: true,
      userId: 1,
      role: "admin",
    });
    mockGetUsers.mockRejectedValue(new Error("db down"));

    const { default: UsersList } = await import("./usersList");
    const ui = await UsersList();
    render(ui);

    expect(
      screen.getByText("Unable to load users. Please try again later."),
    ).toBeInTheDocument();
  });
});
