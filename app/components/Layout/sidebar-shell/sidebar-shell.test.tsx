import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SidebarShell from "./sidebar-shell";

const mockUsePathname = vi.fn(() => "/dashboard");

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
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

describe("SidebarShell", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/dashboard");
  });

  it("renders user navigation links", () => {
    render(<SidebarShell email="user@example.com" role="user" />);

    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Browse Assets").length).toBeGreaterThan(0);
    expect(screen.queryByText("Manage Users")).not.toBeInTheDocument();
  });

  it("renders admin navigation when role is admin", () => {
    render(<SidebarShell email="admin@example.com" role="admin" />);

    expect(screen.getAllByText("Manage Users").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Admin Dashboard").length).toBeGreaterThan(0);
  });

  it("opens the mobile drawer when expand is clicked", async () => {
    const user = userEvent.setup();
    render(<SidebarShell email="user@example.com" role="user" />);

    await user.click(screen.getByLabelText("Expand sidebar"));
    expect(screen.getByLabelText("Collapse sidebar")).toBeInTheDocument();
  });
});
