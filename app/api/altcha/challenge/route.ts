import { createChallenge } from 'altcha-lib';
export async function GET() {
    const key = process.env.HMAC_KEY;
    if (!key) {
        return new Response(JSON.stringify({ error: 'HMAC_KEY not set' }))
    }
    const challenge = await createChallenge({ hmacKey:key});
    return new Response(JSON.stringify({ ...challenge }), {
        headers: { 'Content-Type': 'application/json' },
    });
}
