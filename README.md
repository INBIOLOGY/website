# INBIOLOGY Academy

Next.js application for selling and delivering online biology courses.

## Status

The original Vite UI prototype is being migrated incrementally to Next.js App Router and strict TypeScript. Public routes are statically rendered. Authentication, orders, and payments use safe API boundaries and intentionally return `503` until their database/provider implementations are connected; the browser can no longer grant admin access or course enrollment by itself.

## Requirements

- Node.js 22+
- npm 11+
- PostgreSQL (required from the database milestone onward)

## Local development

```bash
npm ci
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

For local database-backed authentication and orders:

```bash
npm run db:up
npm run db:migrate
```

## Quality gates

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

All four commands must pass before merging.

## Structure

- `app/` — Next.js routes, layouts, route handlers, and providers
- `features/` — feature contracts and client/service boundaries
- `src/App.jsx` — temporary legacy UI shell being split into typed features
- `lib/` — shared server/runtime configuration
- `public/` — static assets pending optimization and storage migration

## Security rules

- Never place secrets in variables prefixed with `NEXT_PUBLIC_`.
- Prices, coupons, payments, roles, and enrollments must be verified server-side.
- Enrollment is created only after a verified payment webhook or audited admin action.
- Course media must use authorization checks and short-lived signed URLs.

The original UI is preserved in the `ui-prototype-v1` Git tag. Migration work lives on `migration/nextjs-typescript`.
