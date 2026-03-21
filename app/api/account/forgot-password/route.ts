import generateOTP from '@/app/lib/utilities';
import { sendOTPEmail } from '@/app/lib/email';
import { verifyAltchaToken } from '@/app/lib/altcha';
import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
    try {
        const { email, altcha } = (await request.json()) as {
            email: string;
            altcha: string;
        };
        if (!email || !altcha) {
            return Response.json({ message: 'email and altcha are required' }, { status: 400 });
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
            SELECT id FROM users
            WHERE work_email = ${email}
            LIMIT 1;
        `) as Array<{ id: number }>;
        if (!userRows[0]) {
            return Response.json({ message: 'User not found' }, { status: 404 });
        }

        const userId = userRows[0].id;
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await sql`
            DELETE FROM otps
            WHERE user_id = ${userId}
              AND otp_type = 'password_reset';
        `;
        await sql`
            INSERT INTO otps (user_id, otp_code, otp_type, expires_at)
            VALUES (${userId}, ${otp}, 'password_reset', ${otpExpiry});
        `;
        await sendOTPEmail(email, otp);

        return Response.json({ message: 'success' }, { status: 200 });
    } catch (error) {
        return Response.json(
            { message: error instanceof Error ? error.message : 'Invalid request body' },
            { status: 400 }
        );
    }
}