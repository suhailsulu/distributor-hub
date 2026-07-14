import { neon } from "@neondatabase/serverless";

export type ManagedUser = {
  id: number;
  full_name: string;
  work_email: string;
  user_status: string;
  company_name: string | null;
  created_at: string;
};

const NEW_USER_STATUSES = new Set(["unverified", "pending"]);
const EXISTING_USER_STATUSES = new Set(["active", "inactive", "suspended"]);

export async function getUsers(): Promise<ManagedUser[]> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  const sql = neon(databaseUrl);

  const rows = (await sql`
        SELECT
            u.id,
            u.full_name,
            u.work_email,
            u.user_status,
            u.created_at,
            c.company_name
        FROM users u
        LEFT JOIN companies c ON c.id = u.company_id
        ORDER BY u.created_at DESC
    `) as ManagedUser[];

  return rows;
}

export function partitionUsers(users: ManagedUser[]) {
  const newUsers = users.filter((user) =>
    NEW_USER_STATUSES.has(user.user_status),
  );
  const existingUsers = users.filter((user) =>
    EXISTING_USER_STATUSES.has(user.user_status),
  );

  return { newUsers, existingUsers };
}
