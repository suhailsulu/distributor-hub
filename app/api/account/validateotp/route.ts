import { randomBytes } from 'crypto';
import { neon } from '@neondatabase/serverless';
import { sendForgotPasswordEmail } from '@/app/lib/email';
import { verifyAltchaToken } from '@/app/lib/altcha';

type OtpType = 'registration' | 'password_reset';

type OtpRow = {
    id: number;
    otp_code: string;
    expires_at: string;
    otp_type: OtpType;
};

type UserRow = { id: number };

async function generateDBToken(sql: any): Promise<string> {
    let token = randomBytes(32).toString('hex');
    // ensure token is unique in db
    while (true) {
        const rows = (await sql`SELECT id FROM password_reset_tokens WHERE token = ${token} LIMIT 1;`) as Array<{ id: number }>;
        if (rows.length === 0) {
            break;
        }
        token = randomBytes(32).toString('hex');
    }
    return token;
}

export async function POST(request: Request) {
    try {
        const { email, otp, otp_type, altcha } = (await request.json()) as {
            email: string;
            otp: string;
            otp_type: OtpType;
            altcha: string;
        };

        if (!email || !otp || !otp_type || !altcha) {
            return Response.json({ message: 'email, otp, otp_type and altcha are required' }, { status: 400 });
        }

        if (otp_type !== 'registration' && otp_type !== 'password_reset') {
            return Response.json({ message: 'Invalid otp_type' }, { status: 400 });
        }

        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            return Response.json({ message: 'DATABASE_URL is not configured' }, { status: 500 });
        }

        const verifyResult = await verifyAltchaToken(altcha);
        if (!verifyResult.isValid) {
            return Response.json({ message: verifyResult.error }, { status: verifyResult.status });
        }
        const sql = neon(databaseUrl);

        // 1. Lookup user by email
        const userRows = (await sql`
            SELECT id FROM users
            WHERE work_email = ${email}
            LIMIT 1;
        `) as UserRow[];

        if (!userRows[0]) {
            return Response.json({ message: 'Invalid OTP' }, { status: 400 });
        }

        const userId = userRows[0].id;

        // 2. Lookup OTP for this user and type
        const otpRows = (await sql`
            SELECT id, otp_code, expires_at, otp_type FROM otps
            WHERE user_id = ${userId}
              AND otp_type = ${otp_type}
            ORDER BY created_at DESC
            LIMIT 1;
        `) as OtpRow[];

        if (!otpRows[0]) {
            return Response.json({ message: 'Invalid OTP' }, { status: 400 });
        }

        const record = otpRows[0];

        // 3. Check expiry
        if (new Date(record.expires_at) < new Date()) {
            await sql`DELETE FROM otps WHERE id = ${record.id};`;
            return Response.json({ message: 'OTP has expired' }, { status: 400 });
        }

        // 4. Check code
        if (record.otp_code !== otp) {
            return Response.json({ message: 'Invalid OTP' }, { status: 400 });
        }

        // 5. OTP is valid — delete it
        await sql`DELETE FROM otps WHERE id = ${record.id};`;

        // 6. Handle per type
        if (otp_type === 'registration') {
            await sql`
                UPDATE users
                SET user_status = 'pending', updated_at = NOW()
                WHERE id = ${userId};
            `;

            return Response.json({
                message: 'Email verified successfully. Your application is under review.'
            }, {
                status: 200
            });
        }

        // password_reset: generate signed token and send reset email
        const resetToken = await generateDBToken(sql);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
        const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
        // store the token in db so that token can be deleted once used or expired after 4 hours
        const tokenExpiry = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 hours from now
        await sql`
            INSERT INTO password_reset_tokens (user_id, token, expires_at)
            VALUES (${userId}, ${resetToken}, ${tokenExpiry});
        `;
        await sendForgotPasswordEmail(email, resetLink);
        return Response.json({ message: 'Password reset link sent to your email. Please follow the instructions in the email to reset your password. If you do not receive the email within a few minutes, please check your spam folder or try again.' }, { status: 200 });

    } catch (error) {
        return Response.json(
            { message: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}