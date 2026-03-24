import { sessionOptions } from "@/app/lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function GET() {
    // Clear the authentication cookie by setting it to an empty value and expiring it immediately
    const session = await getIronSession(await cookies(), sessionOptions);
    session.destroy();
    return redirect('/login');
}

export async function POST() {
    const session = await getIronSession(await cookies(), sessionOptions);
    session.destroy();

    return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
}