import generateOTP from '@/app/lib/utilities';
import { sendOTPEmail } from '@/app/lib/email';
import { hashPassword } from '@/app/lib/utilities';
import { neon } from '@neondatabase/serverless';


type FormValues = {
    fullName: string;
    workEmail: string;
    company: string;
    purpose: string;
    password: string;
    confirmPassword: string;
    altcha: string;
    acceptedTerms: boolean;
};

type AltchaVerifyResponse = {
    isValid?: boolean;
    error?: string;
};

export async function POST(request: Request) {
    try {
        const body: FormValues = await request.json();
        const { fullName, workEmail, company, purpose, password, confirmPassword, altcha, acceptedTerms } = body;
        if (password !== confirmPassword) {
            return Response.json({ message: 'Passwords do not match' }, { status: 400 });
        }

        if (!acceptedTerms) {
            return Response.json({ message: 'You must accept terms and conditions' }, { status: 400 });
        }


        if (!fullName || !workEmail || !company || !purpose || !password || !confirmPassword) {
            return Response.json({ message: 'Missing required fields' }, { status: 400 });
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

        const companyRows = (await sql`
            INSERT INTO companies (company_name)
            VALUES (${company})
            ON CONFLICT (company_name)
            DO UPDATE SET company_name = EXCLUDED.company_name
            RETURNING id;
        `) as Array<{ id: number }>;

        const companyId = companyRows[0]?.id;
        if (!companyId) {
            return Response.json({ message: 'Unable to resolve company ID' }, { status: 500 });
        }

        const userRows = (await sql`
            INSERT INTO users (company_id, full_name, work_email, password_hash, purpose, user_status)
            VALUES (${companyId}, ${fullName}, ${workEmail}, ${await hashPassword(password)}, ${purpose}, 'unverified')
            RETURNING id, work_email, user_status;
        `) as Array<{ id: number; work_email: string; user_status: string }>;

        const createdUser = userRows[0];
        if (!createdUser?.id) {
            return Response.json({ message: 'Unable to create user' }, { status: 500 });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await sql`
            DELETE FROM otps
            WHERE user_id = ${createdUser.id};
        `;

        await sql`
            INSERT INTO otps (user_id, otp_code, otp_type, expires_at)
            VALUES (${createdUser.id}, ${otp}, 'registration', ${otpExpiry});
        `;

        await sendOTPEmail(workEmail, otp);

        return Response.json(
            {
                message: 'success',
                user: createdUser,
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            (error as { code?: string }).code === '23505'
        ) {
            return Response.json({ message: 'Email is already registered' }, { status: 409 });
        }

        return Response.json({ message: 'Invalid request payload' }, { status: 400 });
    }
}
