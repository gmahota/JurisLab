# JurisLab — Migration Plan

## Overview

This document describes the migration from the legacy mixed architecture to the modern Next.js App Router architecture.

## Legacy Architecture (Before)

The project had a hybrid, inconsistent structure mixing multiple frameworks:

```
client/src/          ← Legacy React app (never properly wired into Next.js)
  components/
  pages/
  hooks/
  lib/

pages/               ← Next.js Pages Router (partially migrated from client/src)
  _app.tsx           ← Imported from client/src, mixing concerns
  api/               ← API routes (Next.js)
  dashboard/
  judicial-decisions/
  ...

server/              ← Express server (running next-server.ts, not used in Next.js mode)
db/                  ← Legacy ORM client (Neon serverless)
shared/schema.ts     ← Legacy schema definition

components/          ← shadcn/ui components (correct location)
lib/                 ← Mixed utilities
hooks/               ← React hooks
```

**Problems:**
- `pages/_app.tsx` imported directly from `client/src/` (fragile cross-directory dependency)
- Two parallel component trees (`client/src/components/` and `components/`)
- Express server (`server/index.ts`) not compatible with Next.js deployment model
- No App Router — missing RSC, Server Actions, streaming
- Legacy ORM instead of Prisma (less type-safe migrations, less ecosystem support)
- No clear separation between server and client code

## New Architecture (After)

Clean Next.js App Router structure with no legacy entanglements:

```
app/                 ← All pages and layouts (App Router)
components/          ← All UI components (shadcn/ui + custom)
lib/                 ← Server utilities (prisma, auth, validators)
actions/             ← Server Actions (CRUD operations)
prisma/              ← Schema + seeds
types/               ← TypeScript definitions
middleware.ts        ← Route protection
```

## Migration Steps Completed

| Step | Status | Notes |
|------|--------|-------|
| Archive legacy code to `/legacy/` | ✅ Done | client/, server/, db/, shared/, pages/ |
| Install Prisma + generate client | ✅ Done | Replaced legacy ORM |
| Create `prisma/schema.prisma` | ✅ Done | All 7 models with proper enums |
| Create `lib/prisma.ts` singleton | ✅ Done | Dev + production safe |
| Create `types/index.ts` | ✅ Done | TypeScript types aligned with schema |
| Create `lib/validators/` | ✅ Done | Zod schemas for decisions + contracts |
| Create `lib/auth.ts` | ✅ Done | Placeholder auth utilities |
| Create `lib/permissions.ts` | ✅ Done | Role-based guards |
| Create `app/layout.tsx` | ✅ Done | Root layout with metadata |
| Create `app/globals.css` | ✅ Done | Full CSS variable system |
| Create `app/page.tsx` | ✅ Done | Premium landing page (Portuguese) |
| Create `app/dashboard/` | ✅ Done | Full dashboard with sidebar + topbar |
| Create all module pages | ✅ Done | decisions, contracts, favourites, history, insights, notifications |
| Create `app/admin/` | ✅ Done | Admin area |
| Create Server Actions | ✅ Done | Mock data, Zod validated |
| Create `middleware.ts` | ✅ Done | Route protection (ready for real auth) |
| Update `tsconfig.json` paths | ✅ Done | @/actions, @/types, @/app |
| Update `tailwind.config.ts` | ✅ Done | app/** added to content |
| Update `package.json` scripts | ✅ Done | dev: next dev, prisma scripts |

## Pending (Next Steps)

1. **Real Authentication** — Implement NextAuth.js or custom JWT auth
2. **Database Connection** — Connect to PostgreSQL and run `prisma db push`
3. **Seed Database** — Run `prisma/seed.ts` with realistic data
4. **API Routes** — Migrate useful API routes from `legacy/pages/api/` to `app/api/`
5. **AI Integration** — Wire up OpenAI/Anthropic from `legacy/server/services/ai-service.ts`
6. **Full-text Search** — Implement PostgreSQL full-text search in actions
7. **File Downloads** — Implement contract PDF generation/download
8. **Analytics** — Migrate analytics pages from legacy

## Breaking Changes

- The Express server (`server/index.ts`) is no longer the entry point — Next.js handles everything
- Legacy ORM is replaced by Prisma — requires `prisma db push` before first run
- All routes now use App Router conventions (`app/` dir) instead of Pages Router (`pages/`)
- API routes now live in `app/api/` not `pages/api/`
- `DATABASE_URL` environment variable is still required (same format, works with Neon)

## Environment Variables Required

```env
DATABASE_URL=postgresql://...    # PostgreSQL connection string
NEXTAUTH_SECRET=...              # For auth (when implemented)
OPENAI_API_KEY=...               # For AI features (optional)
ANTHROPIC_API_KEY=...            # For AI features (optional)
```
