import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
    try {
        const body = await request.json() as { email?: string };
        const { email } = body;

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return Response.json({ companyName: null });
        }

        const domain = email.split('@')[1]?.toLowerCase();
        if (!domain) {
            return Response.json({ companyName: null });
        }

        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            return Response.json({ companyName: null });
        }

        const sql = neon(databaseUrl);

        const rows = (await sql`
            SELECT c.company_name
            FROM companies c
            INNER JOIN users u ON u.company_id = c.id
            WHERE LOWER(SPLIT_PART(u.work_email, '@', 2)) = ${domain}
            LIMIT 1
        `) as Array<{ company_name: string }>;

        return Response.json({ companyName: rows[0]?.company_name ?? null });
    } catch {
        return Response.json({ companyName: null });
    }
}
