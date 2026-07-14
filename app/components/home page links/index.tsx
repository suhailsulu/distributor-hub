import Link from "next/link";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, type SessionData } from "@/app/lib/session";

export default async function HomePageLinks() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );
  const isLoggedIn = !!session.isLoggedIn && !!session.userId;

  if (isLoggedIn) {
    return (
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/dashboard"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0f82ca] px-6 text-sm font-semibold text-white transition hover:bg-[#0b70b0]"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/api/account/logout"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0f82ca] px-6 text-sm font-semibold text-white transition hover:bg-[#0b70b0]"
        >
          Logout
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
      <Link
        href="/login"
        className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0f82ca] px-6 text-sm font-semibold text-white transition hover:bg-[#0b70b0]"
      >
        Go to Login
      </Link>
      <Link
        href="/register"
        className="inline-flex h-12 items-center justify-center rounded-xl border border-[#b8cade] bg-white px-6 text-sm font-semibold text-[#1a2f4c] transition hover:bg-[#f3f8fd]"
      >
        Request Access
      </Link>
    </div>
  );
}
