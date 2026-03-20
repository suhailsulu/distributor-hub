import { verifySolution } from 'altcha-lib';

type VerifyAltchaResult = {
    isValid: boolean;
    status: number;
    error?: string;
};

export async function verifyAltchaToken(altcha: string): Promise<VerifyAltchaResult> {
    const key = process.env.HMAC_KEY;

    if (!key) {
        return {
            isValid: false,
            status: 500,
            error: 'HMAC_KEY not set',
        };
    }

    try {
        const isValid = await verifySolution(altcha, key);

        if (!isValid) {
            return {
                isValid: false,
                status: 400,
                error: 'Altcha verification failed',
            };
        }

        return {
            isValid: true,
            status: 200,
        };
    } catch {
        return {
            isValid: false,
            status: 502,
            error: 'Unable to verify Altcha token',
        };
    }
}

export type { VerifyAltchaResult };