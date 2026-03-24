import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

import { type SessionData, sessionOptions } from "@/app/lib/session";

import SidebarShell from "./sidebar-shell";

export default async function Sidebar() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    const isLoggedIn = !!session.isLoggedIn && !!session.userId;

    if (!isLoggedIn) {
        return null;
    }

    return <SidebarShell email={session.email || "User"} role={session.role || "user"} />;
}