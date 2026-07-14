import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getUsers, partitionUsers } from "@/app/lib/usermanagement";
import { sessionOptions, type SessionData } from "@/app/lib/session";

import ExistingUsers from "../existingUsers";
import NewUsers from "../newUsers";

export default async function UsersList() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );

  if (!session.isLoggedIn || !session.userId) {
    redirect(`/login?returnUrl=${encodeURIComponent("/admin/users")}`);
  }

  if (session.role !== "admin") {
    redirect("/dashboard");
  }

  let users;
  try {
    users = await getUsers();
  } catch {
    return (
      <div className="p-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Unable to load users. Please try again later.
        </div>
      </div>
    );
  }

  const { newUsers, existingUsers } = partitionUsers(users);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden p-4">
      <header className="shrink-0">
        <h1 className="text-2xl font-bold text-[#10253d]">Users List</h1>
        <p className="mt-2 text-sm text-[#587796]">Manage users here</p>
      </header>

      <div className="mt-6 flex min-h-0 flex-1 flex-col gap-4 md:flex-row md:gap-6">
        <NewUsers users={newUsers} />
        <ExistingUsers users={existingUsers} />
      </div>
    </div>
  );
}
