import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TopbarLinks from "./topbar-links";

const mockReplace = vi.fn();
const mockRefresh = vi.fn();
const mockUsePathname = vi.fn(() => "/dashboard");

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({
    replace: mockReplace,
    refresh: mockRefresh,
  }),
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

describe("TopbarLinks", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/dashboard");
    mockReplace.mockReset();
    mockRefresh.mockReset();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      }),
    );
  });

  it("toggles the user menu", async () => {
    const user = userEvent.setup();
    render(<TopbarLinks />);

    expect(screen.queryByText("Reset Password")).not.toBeInTheDocument();
    await user.click(screen.getByTitle("User menu"));
    expect(screen.getByText("Reset Password")).toBeInTheDocument();
  });

  it("shows dashboard link on the root path", async () => {
    mockUsePathname.mockReturnValue("/");
    const user = userEvent.setup();
    render(<TopbarLinks />);

    await user.click(screen.getByTitle("User menu"));
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("logs out and redirects home", async () => {
    const user = userEvent.setup();
    render(<TopbarLinks />);

    await user.click(screen.getByTitle("User menu"));
    await user.click(screen.getByText("Logout"));

    expect(fetch).toHaveBeenCalledWith("/api/account/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    expect(mockReplace).toHaveBeenCalledWith("/");
    expect(mockRefresh).toHaveBeenCalled();
  });
});
