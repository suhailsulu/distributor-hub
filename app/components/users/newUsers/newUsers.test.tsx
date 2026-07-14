import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NewUsers from "./newUsers";
import type { ManagedUser } from "@/app/lib/usermanagement";

const users: ManagedUser[] = [
  {
    id: 2,
    full_name: "Grace Hopper",
    work_email: "grace@example.com",
    user_status: "pending",
    company_name: null,
    created_at: "2026-01-02T00:00:00.000Z",
  },
];

describe("NewUsers", () => {
  it("shows an empty state when there are no users", () => {
    render(<NewUsers users={[]} />);
    expect(screen.getByText("No new users.")).toBeInTheDocument();
  });

  it("renders user rows and fallback company", () => {
    render(<NewUsers users={users} />);
    expect(screen.getByText("Grace Hopper")).toBeInTheDocument();
    expect(screen.getByText("grace@example.com")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
