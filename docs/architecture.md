# JurisLab — Architecture

## Overview

JurisLab is a legal-tech platform built for the Brazilian market, providing access to judicial decisions, labour contracts, and AI-powered legal insights.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| ORM | Prisma |
| Database | PostgreSQL |
| Validation | Zod |
| State | React Server Components + Server Actions |

## Directory Structure

```
app/                    # Next.js App Router pages
  layout.tsx            # Root layout (fonts, global providers)
  page.tsx              # Landing/marketing page
  globals.css           # Global CSS variables and Tailwind base
  dashboard/            # Authenticated user area
    layout.tsx          # Dashboard shell (sidebar + topbar)
    page.tsx            # Dashboard home (stats, recent activity)
    decisions/          # Judicial decisions module
    contracts/          # Labour contracts module
    favourites/         # User favourites
    history/            # Activity history
    insights/           # AI insights
    notifications/      # Notifications centre
  admin/                # Admin area (ADMIN role required)
    layout.tsx
    page.tsx
    users/
    decisions/
    contracts/

components/             # Reusable UI components
  ui/                   # shadcn/ui primitives
  dashboard/            # Dashboard-specific components (sidebar, topbar)
  cards/                # Card components
  tables/               # Table components
  forms/                # Form components

lib/                    # Shared utilities and services
  prisma.ts             # Prisma client singleton
  auth.ts               # Authentication utilities
  permissions.ts        # Role-based access control
  utils.ts              # General utilities (cn, formatDate, etc.)
  validators/           # Zod validation schemas
    decision.ts
    contract.ts

actions/                # Next.js Server Actions
  decisions.ts          # Judicial decisions CRUD
  contracts.ts          # Labour contracts CRUD
  favorites.ts          # User favourites
  history.ts            # User history
  insights.ts           # AI insights
  notifications.ts      # Notifications

prisma/                 # Database schema and seeds
  schema.prisma         # Prisma schema definition
  seed.ts               # Development seed data

types/                  # TypeScript type definitions
  index.ts

middleware.ts           # Route protection middleware

legacy/                 # Archived legacy code (pre-migration)
  client/               # Original Vite/React client
  server/               # Express server
  db/                   # Drizzle ORM client
  shared/               # Drizzle schema
  pages/                # Next.js Pages Router (old)

docs/                   # Documentation
public/                 # Static assets
```

## Data Models

### User
- Authentication with `passwordHash` (never plain password)
- Roles: `USER` | `ADMIN`
- Slug for public-friendly URLs

### JudicialDecision
- Core legal document with `caseNumber`, `jurisdiction`, `category`, `judge`, `parties`
- Full-text `content` and short `summary`
- JSON `tags` array for flexible categorisation
- Indexes on `title`, `caseNumber`, `jurisdiction`, `category` for performance

### LaborContract
- `contractType` (Employment, Consulting, Termination, etc.)
- `industry` classification
- Download counter

### UserFavorite / UserHistory
- Polymorphic references via `documentType` enum + `documentId`
- Tracks both `JUDICIAL_DECISION` and `LABOR_CONTRACT`

### AiInsight
- Types: `SUMMARY` | `ANALYSIS` | `TREND`
- `confidence` score (0–1)
- Optional link to source document

### Notification
- Types: `INFO` | `WARNING` | `SUCCESS`
- `read` boolean for unread state management

## Server Actions Pattern

All data mutations use Next.js Server Actions with Zod validation:

```typescript
'use server'

export async function createDecision(input: unknown) {
  const data = createDecisionSchema.parse(input)
  // ... prisma.judicialDecision.create(...)
  revalidatePath('/dashboard/decisions')
  return { success: true, id: decision.id }
}
```

## Authentication

Currently using a placeholder cookie-based approach (`jurislab-session`). Ready to integrate:
- NextAuth.js for full OAuth + credentials support
- JWT tokens with role claims
- Middleware-based route protection (`middleware.ts`)

## Route Protection

| Route | Required Role |
|-------|--------------|
| `/dashboard/*` | Any authenticated user |
| `/admin/*` | ADMIN role |
| `/` | Public |
