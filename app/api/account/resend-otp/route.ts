import { neon } from '@neondatabase/serverless';
import { sendOTPEmail } from '@/app/lib/email';
import generateOTP from '@/app/lib/utilities';

type OtpType = 'registration' | 'password_reset';

type RequestBody = {
    email: string;
    otp_type: OtpType;
};

type UserRow = {
    id: number;
};

export async function POST(request: Request) {
    try {
        const { email, otp_type } = (await request.json()) as RequestBody;

        if (!email || !otp_type) {
            return Response.json({ message: 'email and otp_type are required' }, { status: 400 });
        }

        if (otp_type !== 'registration' && otp_type !== 'password_reset') {
            return Response.json({ message: 'Invalid otp_type' }, { status: 400 });
        }

        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            return Response.json({ message: 'DATABASE_URL is not configured' }, { status: 500 });
        }

        const sql = neon(databaseUrl);

        const userRows = (await sql`
            SELECT id
            FROM users
            WHERE work_email = ${email}
            LIMIT 1;
        `) as UserRow[];

        const user = userRows[0];
        if (!user) {
            return Response.json({ message: 'User not found' }, { status: 404 });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await sql`
            DELETE FROM otps
            WHERE user_id = ${user.id};
        `;

        await sql`
            INSERT INTO otps (user_id, otp_code, otp_type, expires_at)
            VALUES (${user.id}, ${otp}, ${otp_type}, ${otpExpiry});
        `;

        const emailResult = await sendOTPEmail(email, otp);

        return Response.json({ message: 'OTP resent successfully', emailResponse: emailResult }, { status: 200 });
    } catch (error) {
        return Response.json(
            { message: error instanceof Error ? error.message : 'Unable to resend OTP' },
            { status: 500 }
        );
    }
}
