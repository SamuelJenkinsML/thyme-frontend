# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is this?

Thyme is a streaming feature platform frontend built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4. It provides a UI for managing featuresets, pipelines/jobs, sources, and inspecting feature values.

## Related Repositories

- `~/Projects/thyme` — core backend (definition service, query server, pipeline engine)
- `~/Projects/thyme-sdk` — Thyme SDK (client libraries, API definitions)

## Commands

- `npm run dev` — start dev server (localhost:3000)
- `npm run build` — production build (also serves as the type-check since there's no separate lint/test setup)

## Environment

Copy `.env.local.example` to `.env.local`. Two backend services:
- `DEFINITION_SERVICE_URL` — definition service (default: `http://localhost:8080`), serves featuresets, jobs, sources
- `QUERY_SERVER_URL` — query server (default: `http://localhost:8081`), serves feature lookups

## Architecture

### Routing

Uses Next.js App Router with a route group layout:
- `/` — marketing landing page (`app/page.tsx`, no sidebar)
- `/(app)/*` — main app pages with sidebar layout (`app/(app)/layout.tsx`)
  - `/(app)/catalog` — catalog browser (datasets, featuresets, pipelines tabs)
  - `/(app)/inspect` — feature value lookup
  - `/(app)/jobs` — job monitoring
  - `/(app)/sources` — source monitoring

### API Layer

Browser requests go through Next.js API route proxies at `app/(app)/api/proxy/` which forward to backend services. Server-side code calls backends directly using `DEFINITION_SERVICE_URL`.

- `lib/api/definition.ts` — fetches featuresets, jobs, sources (auto-detects server vs client context)
- `lib/api/query.ts` — fetches feature values (client-only, goes through proxy)
- `lib/hooks/` — React Query hooks wrapping each API call

### Data Fetching

Uses TanStack React Query (`@tanstack/react-query`). The `QueryClientProvider` is in `components/providers.tsx`, client singleton in `lib/query-client.ts` (30s stale time, 1 retry).

### UI Stack

- Tailwind CSS 4 with `tw-animate-css` for animations
- shadcn-style components in `components/ui/` (uses `class-variance-authority`, `clsx`, `tailwind-merge`)
- `lucide-react` for icons
- `motion` (Framer Motion) for animations
- `@base-ui/react` for headless primitives
- Fonts: Geist, Geist Mono, Space Grotesk, DM Sans
- Dark mode is the default (`<html className="dark">`)

### Path Aliases

`@/*` maps to the project root (configured in `tsconfig.json`).

### Domain Types

All domain types are in `lib/types.ts`: `FeaturesetRecord`, `JobRecord`, `SourceRecord`, `FeatureQuery`/`FeatureResponse`, and pipeline operator union types.

## Kanban — Cross-Repo Task Tracking

All Thyme task tracking lives in `~/Projects/thyme-docs/09-kanban/`. Tickets are individual markdown files in `09-kanban/tickets/TH-NNN.md` with YAML frontmatter (status, priority, repo, type, etc.).

**When to interact with the board:**
- **After fixing a bug or completing a feature**: Find the matching ticket (grep for the bug ID or feature name in `~/Projects/thyme-docs/09-kanban/tickets/`) and set `status: done`, update `updated:` date. Then run `bash ~/Projects/thyme-docs/scripts/sync-board.sh` to update the Visual Board.
- **When you discover a new bug or gap**: Create a new ticket — read the highest TH-NNN in the tickets folder, write TH-{N+1}.md with frontmatter. Set `repo: thyme-frontend`. Then run `bash ~/Projects/thyme-docs/scripts/sync-board.sh`.
- **When starting work on a ticket**: Set `status: in-progress` and `assignee: claude`. Then run `bash ~/Projects/thyme-docs/scripts/sync-board.sh`.

**Ticket frontmatter fields**: ticket-id, title, type (bug|feature|docs|infra|chore), repo, component, priority (p0-p3), status (backlog|todo|in-progress|review|done|cancelled), assignee, effort (xs-xl), created, updated, due, tags, related.

**Do not** create tickets for trivial fixes (typos, formatting). Only track work that represents meaningful bugs, features, or tasks.
