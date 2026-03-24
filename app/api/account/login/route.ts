import { neon } from '@neondatabase/serverless';
import { verifyAltchaToken } from '@/app/lib/altcha';
import { verifyPassword } from '@/app/lib/utilities';
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/app/lib/session";

type LoginBody = {
    email: string;
    password: string;
    altcha: string;
};

type UserRow = {
    id: number;
    work_email: string;
    password_hash: string;
    user_status: string;
    user_role: "user" | "admin";
};

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as LoginBody;
        const { email, password, altcha } = body;

        if (!email || !password) {
            return Response.json({ message: 'Email and password are required' }, { status: 400 });
        }

        if (!altcha) {
            return Response.json({ message: 'Altcha verification is required' }, { status: 400 });
        }

        const verifyResult = await verifyAltchaToken(altcha);
        if (!verifyResult.isValid) {
            return Response.json({ message: verifyResult.error }, { status: verifyResult.status });
        }

        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            return Response.json({ message: 'DATABASE_URL is not configured' }, { status: 500 });
        }

        const sql = neon(databaseUrl);

        const userRows = (await sql`
            SELECT id, work_email, password_hash, user_status, user_role
            FROM users
            WHERE work_email = ${email}
            LIMIT 1;
        `) as UserRow[];

        const user = userRows[0];

        if (!user || !(await verifyPassword(password, user.password_hash))) {
            return Response.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        if (user.user_status === 'unverified') {
            return Response.json({ message: 'Please verify your email before logging in' }, { status: 403 });
        }

        if (user.user_status === 'suspended' || user.user_status === 'inactive') {
            return Response.json({ message: 'Your account has been suspended. Please contact support.' }, { status: 403 });
        }

        if (user.user_status === 'pending') {
            return Response.json({ message: 'Your account is pending review. You will be notified once approved.' }, { status: 403 });
        }
        let role = user.user_role || 'user';

        // Create session
        const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
        session.userId = user.id;
        session.email = user.work_email;
        session.isLoggedIn = true;
        session.role = role;
        await session.save();
        return Response.json({ message: 'Login successful', userId: user.id }, { status: 200 });
    } catch {
        return Response.json({ message: 'Internal server error' }, { status: 500 });
    }
}
