<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project AI Rules

### Stack and Scope
- Use **Next.js App Router** patterns (`app/`), TypeScript, React 19, Tailwind v4, and route handlers in `app/api/**/route.ts`.
- Keep data access server-side only. Database calls must remain in route handlers or server components, never in client components.
- Read `docs/PROJECT.md` for the business/domain model (assets, folders, companies/domains, feedback, admin workflows) before implementing product features.

### API Route Conventions
- Prefer `export async function POST(request: Request)` (or matching HTTP method) and return `Response.json(...)` consistently.
- Validate request payloads early and return clear 4xx responses for missing/invalid fields before performing DB or email work.
- Wrap route logic in `try/catch`; return safe error messages and appropriate status codes.
- Reuse existing response message style (`{ message: string }` or specific payload shapes already used by that endpoint) instead of inventing new formats.

### Database and SQL
- Use `@neondatabase/serverless` with parameterized tagged template queries (`sql\`...\``). Do not build SQL via string concatenation.
- Read `process.env.DATABASE_URL` inside server handlers and handle missing env with a 500 response.
- Match existing schema names and enums from `db/schema.sql` (`users`, `companies`, `otps`, `password_reset_tokens`, `user_status`, `otp_types`).
- When changing authentication/OTP flows, preserve existing lifecycle behavior (delete old OTPs before inserting new ones, enforce expiry checks).

### Auth, Session, and Security
- Use `iron-session` with `sessionOptions` from `app/lib/session.ts`; session shape must stay compatible with `SessionData`.
- For protected server pages, gate access using `getIronSession(await cookies(), sessionOptions)` and redirect unauthenticated users.
- Keep password handling in `app/lib/utilities.ts` helpers (`hashPassword`, `verifyPassword`); do not store or compare plain-text passwords.
- Maintain ALTCHA verification for sensitive endpoints (login, registration, OTP validation, password reset/forgot flows) using `verifyAltchaToken`.
- Never hardcode secrets or expose server-only environment values to client components.

### Email and OTP Flows
- Reuse functions in `app/lib/email.ts` for transactional emails instead of duplicating sending logic in routes.
- Preserve OTP semantics: 6-digit OTP, short expiration window, and per-user replacement of previous OTP records.
- For password reset, keep token issuance and validation aligned with DB-backed `password_reset_tokens` behavior.

### Frontend Conventions
- Use `'use client'` only when hooks/browser APIs are needed. Prefer server components otherwise.
- Continue using `react-hook-form` for form state/validation and existing shared form primitives (`Field`, `PasswordInput`, `OtpModal`).
- Keep ALTCHA widget loaded client-side via dynamic import with `ssr: false` where used in forms.
- Follow existing Tailwind-first styling and current UI tone/colors unless the task explicitly requests a redesign.

### Code Quality
- Keep types explicit for request bodies and query rows (avoid `any` unless unavoidable and tightly scoped).
- Prefer small utility extraction in `app/lib/*` when logic is reused across multiple routes/pages.
- Run lint checks after substantive changes and resolve issues in edited files.
