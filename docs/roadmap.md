# JurisLab — Roadmap

## Vision

JurisLab is becoming the leading legal intelligence platform for Brazilian legal professionals, combining comprehensive legal databases with AI-powered analysis tools.

## Current Status: v0.2 (Post-Migration Foundation)

The application has a solid App Router foundation with mock data and all core modules scaffolded.

---

## Phase 1 — Foundation ✅ (Completed)

- [x] Next.js App Router architecture
- [x] Prisma schema with all core models
- [x] shadcn/ui design system
- [x] Dashboard shell (sidebar, topbar, stats)
- [x] Landing page (Portuguese, premium aesthetic)
- [x] Core module pages (decisions, contracts, insights, favourites, history, notifications)
- [x] Admin area skeleton
- [x] TypeScript path aliases
- [x] Server Actions with Zod validation
- [x] Route protection middleware
- [x] Technical documentation

---

## Phase 2 — Database & Auth (Next Sprint)

- [ ] Connect PostgreSQL via `prisma db push`
- [ ] Run `prisma/seed.ts` with realistic data
- [ ] Implement NextAuth.js authentication
  - [ ] Credentials provider (username/password with bcrypt)
  - [ ] JWT session strategy
  - [ ] Role-based access (USER / ADMIN)
- [ ] Protect `/dashboard/*` and `/admin/*` routes
- [ ] Login / Register pages
- [ ] User profile page

---

## Phase 3 — Full-Featured Modules

### Judicial Decisions
- [ ] PostgreSQL full-text search with `ts_vector`
- [ ] Advanced filters (date range, jurisdiction, category, judge)
- [ ] Pagination with infinite scroll option
- [ ] Decision detail with AI-generated summary
- [ ] PDF view/download
- [ ] Bookmark / Favourite from detail page

### Labour Contracts
- [ ] Contract template library
- [ ] Contract type filters (Employment, Consulting, Termination, etc.)
- [ ] Industry sector filters
- [ ] PDF download with download counter
- [ ] Contract comparison tool

### AI Insights
- [ ] OpenAI / Anthropic integration
- [ ] Auto-generate insights for new decisions
- [ ] Legal trend detection
- [ ] Personalised insights based on user history
- [ ] AI-powered search (semantic search)

---

## Phase 4 — Analytics & Advanced Features

- [ ] Analytics dashboard (views, searches, downloads)
- [ ] User activity charts
- [ ] Jurisdiction breakdown charts
- [ ] Popular decisions heatmap
- [ ] Notification system (email + in-app)
- [ ] Saved searches with alerts
- [ ] Export to PDF / Word

---

## Phase 5 — Scale & Performance

- [ ] Redis caching for popular decisions
- [ ] Database query optimization (indexes, connection pooling)
- [ ] CDN for static assets
- [ ] Rate limiting for API routes
- [ ] Error tracking (Sentry)
- [ ] Analytics (PostHog)
- [ ] SEO optimisation (OpenGraph, structured data)

---

## Module Responsibilities

| Module | Owner | Priority |
|--------|-------|----------|
| Judicial Decisions | Core | High |
| Labour Contracts | Core | High |
| AI Insights | AI Team | High |
| Authentication | Platform | Critical |
| Notifications | Platform | Medium |
| Analytics | Data | Medium |
| Admin | Platform | Medium |
| Search | Core | High |

---

## API Strategy

All data operations use Next.js Server Actions by default. REST API routes in `app/api/` are reserved for:
- External integrations (mobile app, third-party tools)
- Webhook endpoints
- Large file uploads/downloads

---

## Design Principles

1. **Portuguese-first** — All UI copy in Brazilian Portuguese
2. **Legal professional UX** — Dense information, fast navigation, keyboard shortcuts
3. **Dark mode ready** — Full CSS variable system
4. **Accessible** — WCAG AA compliance target
5. **Mobile responsive** — All screens work on tablet and mobile
6. **Performance** — Core Web Vitals green across all pages
