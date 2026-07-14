import { describe, expect, it } from "vitest";
import { partitionUsers, type ManagedUser } from "./usermanagement";

const user = (
  overrides: Partial<ManagedUser> & Pick<ManagedUser, "user_status">,
): ManagedUser => ({
  id: 1,
  full_name: "Test User",
  work_email: "test@example.com",
  company_name: "Acme",
  created_at: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("partitionUsers", () => {
  it("splits new and existing users by status", () => {
    const users = [
      user({ id: 1, user_status: "unverified" }),
      user({ id: 2, user_status: "pending" }),
      user({ id: 3, user_status: "active" }),
      user({ id: 4, user_status: "inactive" }),
      user({ id: 5, user_status: "suspended" }),
      user({ id: 6, user_status: "unknown" }),
    ];

    const { newUsers, existingUsers } = partitionUsers(users);

    expect(newUsers.map((item) => item.id)).toEqual([1, 2]);
    expect(existingUsers.map((item) => item.id)).toEqual([3, 4, 5]);
  });

  it("returns empty arrays when there are no users", () => {
    expect(partitionUsers([])).toEqual({ newUsers: [], existingUsers: [] });
  });
});
