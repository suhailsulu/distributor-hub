import { verifyAltchaToken } from '@/app/lib/altcha';

export async function POST(request: Request) {
    const { altcha } = await request.json();
    const result = await verifyAltchaToken(altcha);

    return Response.json(
        {
            isValid: result.isValid,
            error: result.error,
        },
        { status: result.status }
    );
}
