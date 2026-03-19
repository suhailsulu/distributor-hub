import { neon } from '@neondatabase/serverless';
import { verifyPassword } from '@/app/lib/utilities';

type LoginBody = {
    email: string;
    password: string;
    altcha: string;
};

type AltchaVerifyResponse = {
    isValid?: boolean;
    error?: string;
};

type UserRow = {
    id: number;
    work_email: string;
    password_hash: string;
    user_status: string;
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

        const verifyUrl = new URL('/api/altcha/verify', request.url);
        const altchaResponse = await fetch(verifyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ altcha }),
            cache: 'no-store',
        });

        if (!altchaResponse.ok) {
            return Response.json({ message: 'Unable to verify Altcha token' }, { status: 502 });
        }

        const verifyResult = (await altchaResponse.json()) as AltchaVerifyResponse;
        if (!verifyResult.isValid) {
            return Response.json({ message: 'Altcha verification failed' }, { status: 400 });
        }

        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            return Response.json({ message: 'DATABASE_URL is not configured' }, { status: 500 });
        }

        const sql = neon(databaseUrl);

        const userRows = (await sql`
            SELECT id, work_email, password_hash, user_status
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

        return Response.json({ message: 'Login successful', userId: user.id }, { status: 200 });
    } catch {
        return Response.json({ message: 'Internal server error' }, { status: 500 });
    }
}
