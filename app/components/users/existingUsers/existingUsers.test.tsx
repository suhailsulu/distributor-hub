import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ExistingUsers from "./existingUsers";
import type { ManagedUser } from "@/app/lib/usermanagement";

const users: ManagedUser[] = [
  {
    id: 1,
    full_name: "Ada Lovelace",
    work_email: "ada@example.com",
    user_status: "active",
    company_name: "Analytical Engines",
    created_at: "2026-01-01T00:00:00.000Z",
  },
];

describe("ExistingUsers", () => {
  it("shows an empty state when there are no users", () => {
    render(<ExistingUsers users={[]} />);
    expect(screen.getByText("No existing users.")).toBeInTheDocument();
  });

  it("renders user rows", () => {
    render(<ExistingUsers users={users} />);
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("ada@example.com")).toBeInTheDocument();
    expect(screen.getByText("Analytical Engines")).toBeInTheDocument();
  });
});
