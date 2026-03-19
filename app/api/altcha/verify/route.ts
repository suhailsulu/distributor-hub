//altcha verify
import { verifySolution } from 'altcha-lib';
export async function POST(request: Request) {
    const { altcha } = await request.json();
    const key = process.env.HMAC_KEY;
    if (!key) {
        return new Response(JSON.stringify({ error: 'HMAC_KEY not set' }))
    }
    const isValid = await verifySolution(altcha, key);
    return new Response(JSON.stringify({ isValid: isValid }), {
        headers: { 'Content-Type': 'application/json' },
    });
}
