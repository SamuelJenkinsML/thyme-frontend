# Thyme Frontend Roadmap

This roadmap defines the features needed to bring thyme-frontend to production as a multi-tenant streaming feature platform. Each task is scoped for an AI agent to pick up and implement independently.

The system follows a **control plane / data plane** architecture:
- **Control plane**: Shared service managing tenants, auth, billing, and routing
- **Data plane**: Per-tenant (or shared-pool) instances of definition-service, engine, query-server, Kafka, and RocksDB

---

## Phase 1: Auth & Tenant Foundation

The prerequisite for everything else. Establishes identity, organizations, and the routing layer that makes multi-tenancy possible.

### 1.1 — Authentication with SSO

**Goal**: Users can sign up, log in, and authenticate via email/password and SSO providers (Google, GitHub, SAML/OIDC for enterprise).

**Requirements**:
- Integrate an auth provider (Auth.js v5 or Clerk) into the Next.js app
- Add sign-up, login, and forgot-password pages at `/auth/login`, `/auth/signup`, `/auth/forgot-password`
- Support OAuth providers: Google and GitHub at minimum
- Support SAML/OIDC enterprise SSO (configurable per organization)
- Store a session cookie (httpOnly, secure) and expose a `useSession()` hook
- Add an auth middleware in `middleware.ts` that protects all `/(app)/*` routes — unauthenticated users redirect to `/auth/login`
- The landing page (`/`) and docs (`/docs`) remain public
- Add a user avatar + dropdown menu to the sidebar with: profile link, org switcher, and sign-out

**API surface needed** (control plane):
- `POST /auth/signup` — create account
- `POST /auth/login` — email/password login
- `GET /auth/session` — validate session, return user + org context
- `POST /auth/sso/configure` — configure SSO for an org
- OAuth callback routes

**Files to create/modify**: `middleware.ts`, `app/auth/*`, `lib/auth.ts`, `components/layout/user-menu.tsx`, `components/layout/sidebar.tsx`

---

### 1.2 — Organization & Workspace Model

**Goal**: Users belong to organizations. Each org is a tenant with its own data plane. The frontend routes all API calls through the org's data plane.

**Requirements**:
- Add an org creation flow at `/onboarding/create-org` shown after first login if the user has no org
- Add an org switcher dropdown in the sidebar (users can belong to multiple orgs)
- Store the active org in a cookie or URL path prefix (e.g., `/(app)/[orgSlug]/*`)
- All API proxy routes (`app/(app)/api/proxy/*`) must read the active org context and route requests to the correct data plane URL
- Add an org settings page at `/(app)/settings/organization` with: org name, slug, logo upload, and danger zone (delete org)
- Add a members page at `/(app)/settings/members` showing org members with roles

**Domain types to add** (`lib/types.ts`):
```typescript
interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  plan: "free" | "team" | "enterprise";
  data_plane_url: string;
  created_at: string;
}

interface OrgMember {
  user_id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: "owner" | "admin" | "member" | "viewer";
  joined_at: string;
}
```

**API surface needed** (control plane):
- `POST /api/v1/orgs` — create org
- `GET /api/v1/orgs` — list user's orgs
- `GET /api/v1/orgs/:slug` — get org details
- `PATCH /api/v1/orgs/:slug` — update org
- `DELETE /api/v1/orgs/:slug` — delete org
- `GET /api/v1/orgs/:slug/members` — list members
- `POST /api/v1/orgs/:slug/invites` — invite member
- `PATCH /api/v1/orgs/:slug/members/:userId` — update role
- `DELETE /api/v1/orgs/:slug/members/:userId` — remove member

---

### 1.3 — Role-Based Access Control (RBAC)

**Goal**: Org members have roles that gate what they can see and do. The frontend enforces permissions in the UI and the backend enforces them on the API.

**Requirements**:
- Define four roles: `owner`, `admin`, `member`, `viewer`
  - **Owner**: Full access, can delete org, manage billing, manage SSO
  - **Admin**: Can manage members, commit definitions, delete pipelines, manage environments
  - **Member**: Can commit definitions, inspect features, view everything
  - **Viewer**: Read-only access to catalog, inspect, monitoring
- Create a `usePermissions()` hook that returns the current user's role and helper functions like `canCommit()`, `canManageMembers()`, `canDeletePipeline()`
- Gate UI elements: hide "Delete" buttons for viewers, disable commit actions for viewers, hide settings pages for non-admins
- API proxy routes should forward the user's auth token so the backend can enforce permissions server-side
- Add a `PermissionGate` wrapper component: `<PermissionGate requires="commit"><Button>Deploy</Button></PermissionGate>`

**Files to create**: `lib/permissions.ts`, `components/shared/permission-gate.tsx`, `lib/hooks/use-permissions.ts`

---

### 1.4 — Invite & Onboarding Flow

**Goal**: Org admins can invite new members via email. Invited users land on a streamlined onboarding.

**Requirements**:
- Add an invite modal on the members settings page — admin enters email(s) and selects a role
- Generate invite links with a token; invited users who don't have an account are directed to sign up first, then auto-join the org
- Add an `/auth/accept-invite/[token]` page that validates the token and adds the user to the org
- Show a first-time onboarding wizard for new org members:
  1. Welcome screen with org name
  2. "Install the SDK" step showing `pip install thyme-sdk` and API key setup
  3. "Commit your first feature" step with a code snippet
  4. "Explore the catalog" CTA linking to the catalog page
- Track onboarding completion per user so it's only shown once

**Files to create**: `app/auth/accept-invite/[token]/page.tsx`, `app/(app)/onboarding/*`, `components/onboarding/*`

---

## Phase 2: Feature Management & Governance

Moves the frontend from read-only to read-write. Users can manage the full lifecycle of their feature definitions.

### 2.1 — Definition CRUD & Commit History

**Goal**: Users can view, compare, and roll back feature definitions. The catalog becomes a living registry with version history.

**Requirements**:
- Add a "History" tab on each featureset, pipeline, and dataset detail page
- Show commit history as a timeline: each entry has commit ID, timestamp, committer (user), message, and a diff summary (fields added/removed/changed)
- Add a "Compare versions" view that shows a side-by-side or unified diff of the definition spec between two versions
- Add a "Rollback to this version" button that triggers a new commit reverting to the selected version's spec
- Add a "Delete" action on pipelines and datasets (with confirmation modal) for admins — calls `DELETE /api/v1/pipelines/:name` or `DELETE /api/v1/jobs/:name`
- Show the current schema version number on detail pages and in the catalog cards

**API surface needed**:
- `GET /api/v1/events?type=commit` — commit history (already exists in backend)
- `GET /api/v1/datasets/:name/versions` — version history
- `POST /api/v1/commit` — rollback is just a new commit with the old spec
- `DELETE /api/v1/pipelines/:name` — already exists in backend

**Files to modify**: `app/(app)/catalog/featuresets/[name]/page.tsx`, `app/(app)/catalog/pipelines/[name]/page.tsx`, `app/(app)/catalog/datasets/[name]/page.tsx`
**Files to create**: `components/catalog/version-history.tsx`, `components/catalog/version-diff.tsx`, `components/shared/confirm-modal.tsx`

---

### 2.2 — Web-Based Feature Authoring (SDK-in-Browser)

**Goal**: Users can define features directly in the browser using a Python code editor, validate them, and commit without touching the CLI.

**Requirements**:
- Add a "New Definition" page at `/(app)/definitions/new` with a Monaco or CodeMirror editor configured for Python syntax
- Pre-populate with a template showing `@dataset`, `@pipeline`, `@featureset` boilerplate
- Add a "Validate" button that sends the code to a backend validation endpoint and displays errors inline (line numbers, messages)
- Add a "Commit" button that sends a commit request to the definition service with the parsed definition
- Add a commit message input field (required)
- Show a preview panel next to the editor: as the user types, parse the definition client-side and render a visual preview of the pipeline DAG (datasets -> pipelines -> featuresets)
- Support importing from file upload (`.py` files)

**API surface needed**:
- `POST /api/v1/commit` with `dry_run=true` — validation without persistence (needs backend support)
- `POST /api/v1/commit` — actual commit

**Files to create**: `app/(app)/definitions/new/page.tsx`, `components/definitions/python-editor.tsx`, `components/definitions/definition-preview.tsx`, `components/definitions/dag-visualizer.tsx`

---

### 2.3 — Lineage & Dependency Graph

**Goal**: Users can visualize the full data lineage from sources through pipelines to featuresets, understand dependencies, and assess blast radius of changes.

**Requirements**:
- Add a "Lineage" page at `/(app)/lineage` showing an interactive DAG visualization
- Nodes: Sources (green), Datasets (blue), Pipelines (purple), Featuresets (orange)
- Edges: data flow direction (source -> dataset -> pipeline -> dataset -> featureset)
- Clicking a node opens a detail panel on the right showing the entity's metadata
- Add a "Blast Radius" mode: selecting a node highlights all upstream and downstream dependents
- Add lineage breadcrumbs on detail pages: e.g., on a featureset page, show `Source: postgres.events -> Pipeline: agg_pipeline -> Dataset: agg_output -> Featureset: user_features`
- Use a graph layout library (e.g., @xyflow/react, formerly ReactFlow) for the DAG rendering

**Data source**: Build the graph client-side by cross-referencing featuresets (extractor deps), pipelines (input_datasets -> output_dataset), and sources (dataset)

**Files to create**: `app/(app)/lineage/page.tsx`, `components/lineage/lineage-graph.tsx`, `components/lineage/lineage-detail-panel.tsx`, `lib/lineage.ts` (graph builder utility)

---

### 2.4 — Data Quality & Expectations Dashboard

**Goal**: Users can monitor data quality expectations defined on their datasets and see violation trends.

**Requirements**:
- Add a "Quality" tab on dataset detail pages showing all expectations defined for that dataset
- For each expectation, display: type (e.g., `column_values_between`), column, parameters (min/max/mostly), current pass rate
- Add a "Quality" page at `/(app)/quality` with an aggregated view across all datasets: total expectations, pass rate, failing expectations
- Show a time-series chart of expectation pass rates over the last 24h/7d/30d
- Add alerting badges: green (passing), yellow (>95% but below 100%), red (below threshold)
- Expectations are already defined in the SDK via `@expectations` decorator and stored in the dataset spec

**API surface needed**:
- `GET /api/v1/datasets/:name/expectations/results` — expectation evaluation results over time (needs backend support)
- Current expectations are already available in `DatasetDef.expectations` from the commit

**Files to create**: `app/(app)/quality/page.tsx`, `components/quality/expectations-table.tsx`, `components/quality/quality-trend-chart.tsx`, `components/quality/expectation-badge.tsx`

---

### 2.5 — Feature Search & Discovery

**Goal**: Users can search across all entities (featuresets, features, datasets, pipelines, sources) with full-text search and metadata filters.

**Requirements**:
- Add a global search bar in the top of the sidebar or app header, triggered by `Cmd+K` / `Ctrl+K`
- Search results grouped by type: Features, Featuresets, Pipelines, Datasets, Sources
- Each result shows: name, type badge, brief description (e.g., feature dtype, pipeline operator types)
- Clicking a result navigates to the detail page
- Support filters: entity type, data type (for features), connector type (for sources)
- Client-side implementation initially (filter loaded data); backend search API later
- Add search to the catalog page as well (enhance existing `CatalogSearch` component with `Cmd+K` integration)

**Files to create**: `components/shared/command-palette.tsx`, `lib/hooks/use-search.ts`
**Files to modify**: `components/catalog/catalog-search.tsx`, `components/layout/sidebar.tsx`

---

## Phase 3: Monitoring & Observability

Real production systems need deep observability. This phase adds the metrics, alerts, and operational dashboards users need to trust their feature pipelines.

### 3.1 — Real-Time Pipeline Metrics Dashboard

**Goal**: Users can monitor pipeline throughput, latency, and backpressure in real time.

**Requirements**:
- Enhance the dashboard page (`/(app)/page.tsx`) with a metrics section showing:
  - Events processed per second (per pipeline, aggregated)
  - Processing latency (p50, p95, p99) per pipeline
  - Consumer lag per pipeline partition
  - RocksDB state size per pipeline
- Add a dedicated pipeline metrics page at `/(app)/catalog/pipelines/[name]/metrics`
- Charts: Use a charting library (recharts or visx) for time-series line charts
- Time range selector: Last 1h, 6h, 24h, 7d
- Auto-refresh every 10s with a visible refresh indicator

**API surface needed** (data plane):
- `GET /api/v1/jobs/:name/metrics` — pipeline metrics (needs backend support)
- `GET /api/v1/jobs/:name/partitions` — per-partition stats (lag, offset, lease owner)

**Files to create**: `app/(app)/catalog/pipelines/[name]/metrics/page.tsx`, `components/monitoring/metrics-chart.tsx`, `components/monitoring/partition-table.tsx`, `components/monitoring/time-range-selector.tsx`

---

### 3.2 — Alerting & Notifications

**Goal**: Users can define alert rules on pipeline metrics and data quality, and receive notifications when thresholds are breached.

**Requirements**:
- Add an alerts page at `/(app)/alerts` showing all configured alerts and their current status (firing, resolved, pending)
- Add a "Create Alert" form with:
  - Alert type: metric threshold (e.g., "consumer lag > 10000"), data quality (e.g., "expectation pass rate < 95%"), pipeline health (e.g., "no events processed in 5 minutes")
  - Condition: greater than, less than, equals
  - Threshold value and evaluation window
  - Notification channels: email, Slack webhook, PagerDuty
  - Severity: info, warning, critical
- Show alert history: when it fired, when it resolved, duration
- Add an alert badge to the sidebar showing count of active alerts
- Add inline alert indicators on pipeline and dataset detail pages

**API surface needed** (control plane):
- `POST /api/v1/orgs/:slug/alerts` — create alert rule
- `GET /api/v1/orgs/:slug/alerts` — list alerts
- `GET /api/v1/orgs/:slug/alerts/:id/history` — alert history
- `PATCH /api/v1/orgs/:slug/alerts/:id` — update / mute / delete

**Files to create**: `app/(app)/alerts/page.tsx`, `components/alerts/alert-rule-form.tsx`, `components/alerts/alert-list.tsx`, `components/alerts/alert-badge.tsx`

---

### 3.3 — Audit Log

**Goal**: Org admins can view a detailed audit log of all actions taken within their organization.

**Requirements**:
- Add an audit log page at `/(app)/settings/audit-log`
- Show a filterable, paginated table of events:
  - Columns: Timestamp, Actor (user avatar + name), Action (committed definition, deleted pipeline, invited member, changed role, etc.), Target (entity name), Details
  - Filters: date range, actor, action type
- Source events from the backend's `service_events` table (already exists) combined with control plane auth/member events
- Add a "View Details" expandable row showing the full event payload (JSON)
- Export to CSV

**API surface needed**:
- `GET /api/v1/events` — already exists in definition service
- `GET /api/v1/orgs/:slug/audit-log` — control plane events (needs backend support)

**Files to create**: `app/(app)/settings/audit-log/page.tsx`, `components/settings/audit-log-table.tsx`

---

### 3.4 — System Health & Service Status Page

**Goal**: Expand the existing health checks into a comprehensive status page showing the health of all data plane components.

**Requirements**:
- Enhance the dashboard's system health component to show:
  - Definition Service: status, version, uptime, last commit timestamp
  - Engine: status, active runners count, total partitions, checkpoint status
  - Query Server: status, version, cache hit rate, avg query latency
  - Kafka/Redpanda: broker status, topic count, total consumer lag
  - RocksDB: total state size, compaction status
  - PostgreSQL: connection pool status, migration version
- Add a dedicated status page at `/(app)/status` with detailed per-component breakdowns
- Color-coded status indicators: green (healthy), yellow (degraded), red (down)
- Show incident history: when a component went down and when it recovered

**API surface needed**:
- `GET /health` — already exists on definition-service and query-server
- `GET /api/v1/status` — already exists, may need enrichment

**Files to create**: `app/(app)/status/page.tsx`, `components/status/service-status-card.tsx`, `components/status/status-timeline.tsx`
**Files to modify**: `components/dashboard/system-health.tsx`

---

## Phase 4: Collaboration & Productivity

Features that make Thyme a team workspace rather than a single-user tool.

### 4.1 — Environments (Dev / Staging / Production)

**Goal**: Orgs can maintain separate environments with independent data planes, and promote definitions between them.

**Requirements**:
- Add an environment switcher in the app header (next to org switcher)
- Default environments: `development`, `staging`, `production`
- Each environment points to a different data plane URL
- Add environment management in settings: `/(app)/settings/environments`
  - Create/edit/delete environments
  - Configure data plane URL per environment
  - Set environment color badge (e.g., green=dev, yellow=staging, red=prod)
- Add a "Promote" action on definition detail pages: select source and target environments, show a diff of what will change, confirm to commit the definition to the target environment
- Show the active environment prominently in the UI (colored banner or badge) so users always know where they're working
- Prevent accidental production changes: require confirmation modal for prod commits

**Domain types to add**:
```typescript
interface Environment {
  id: string;
  name: string;
  slug: string;
  data_plane_url: string;
  color: string;
  is_production: boolean;
  created_at: string;
}
```

**Files to create**: `app/(app)/settings/environments/page.tsx`, `components/layout/environment-switcher.tsx`, `components/environments/promote-modal.tsx`
**Files to modify**: `components/layout/sidebar.tsx`, API proxy routes to use active environment's data plane URL

---

### 4.2 — API Keys & SDK Configuration

**Goal**: Users can generate API keys for programmatic access (SDK, CI/CD) and view their SDK configuration.

**Requirements**:
- Add an API keys page at `/(app)/settings/api-keys`
- Users can create named API keys with: name, expiration (30d, 90d, 1y, never), role scope (same RBAC roles)
- Show the key value only once at creation time (copy-to-clipboard)
- List existing keys: name, prefix (first 8 chars), created date, last used, expiration, status (active/expired/revoked)
- Revoke button for each key
- Add a "Quick Start" section showing SDK configuration:
  ```python
  # pip install thyme-sdk
  import thyme
  thyme.configure(api_url="https://api.thyme.dev/orgs/{slug}", api_key="tk_...")
  ```
- Show environment-specific configuration snippets

**API surface needed** (control plane):
- `POST /api/v1/orgs/:slug/api-keys` — create key
- `GET /api/v1/orgs/:slug/api-keys` — list keys
- `DELETE /api/v1/orgs/:slug/api-keys/:id` — revoke key

**Files to create**: `app/(app)/settings/api-keys/page.tsx`, `components/settings/api-key-list.tsx`, `components/settings/create-key-modal.tsx`, `components/settings/sdk-config-snippet.tsx`

---

### 4.3 — Activity Feed & Notifications

**Goal**: Users see a live feed of what's happening in their org and can configure notification preferences.

**Requirements**:
- Add a notification bell icon in the app header with unread count badge
- Clicking opens a dropdown with recent notifications:
  - "Alice committed 3 featuresets" (2 min ago)
  - "Pipeline user_stats_pipeline failed" (15 min ago)
  - "Data quality alert: review_events expectation failing" (1h ago)
  - "Bob invited carol@company.com" (3h ago)
- Add a full activity feed page at `/(app)/activity`
- Notification preferences page at `/(app)/settings/notifications`:
  - Per-category toggles: commits, pipeline failures, alerts, member changes
  - Channel: in-app, email, Slack
- Mark individual or all notifications as read

**Files to create**: `app/(app)/activity/page.tsx`, `app/(app)/settings/notifications/page.tsx`, `components/layout/notification-bell.tsx`, `components/activity/activity-feed.tsx`, `lib/hooks/use-notifications.ts`

---

### 4.4 — Annotations & Documentation

**Goal**: Users can add descriptions, tags, and documentation to any entity in the catalog, making it a self-service knowledge base.

**Requirements**:
- Add an editable "Description" field on every detail page (featureset, pipeline, dataset, source)
- Add a "Tags" field — freeform tags like `fraud`, `real-time`, `critical`, `deprecated`
- Add an "Owner" field — assign a team member as the owner of a featureset or pipeline
- Tags are filterable in the catalog: clicking a tag filters to all entities with that tag
- Add a "README" tab on featureset detail pages — a rich Markdown editor for longer documentation (usage examples, caveats, SLA notes)
- All annotations are stored in the control plane (not the definition service) so they persist across commits

**API surface needed** (control plane):
- `PATCH /api/v1/orgs/:slug/annotations/:entityType/:entityName` — set description, tags, owner, readme
- `GET /api/v1/orgs/:slug/annotations/:entityType/:entityName` — get annotations
- `GET /api/v1/orgs/:slug/tags` — list all tags in the org

**Files to create**: `components/catalog/entity-annotations.tsx`, `components/catalog/tag-input.tsx`, `components/catalog/owner-select.tsx`, `components/catalog/readme-editor.tsx`
**Files to modify**: All detail pages to include annotations section

---

## Phase 5: Self-Service & Billing

Enables Thyme to operate as a SaaS product with self-service signup, plan management, and usage-based billing.

### 5.1 — Self-Service Signup & Org Provisioning

**Goal**: New users can sign up, create an org, and have a data plane provisioned automatically. No manual intervention required.

**Requirements**:
- The sign-up flow (`/auth/signup`) creates a user account
- After signup, redirect to `/onboarding/create-org` where the user names their org
- On org creation, the control plane provisions a data plane:
  - In a shared-pool model (default for free/team plans): assign a namespace in the shared data plane
  - In a dedicated model (enterprise plan): trigger infrastructure provisioning (Terraform/Pulumi) and show a "Provisioning..." status page with progress
- Show a setup checklist after provisioning:
  - [ ] Install SDK (`pip install thyme-sdk`)
  - [ ] Configure API key
  - [ ] Commit first feature definition
  - [ ] Query a feature value
- Track checklist completion and show progress in the sidebar

**Files to create**: `app/(app)/onboarding/create-org/page.tsx`, `app/(app)/onboarding/setup-checklist/page.tsx`, `components/onboarding/provisioning-status.tsx`, `components/onboarding/setup-checklist.tsx`

---

### 5.2 — Subscription Plans & Billing

**Goal**: Orgs can select a plan, enter payment information, and manage their subscription.

**Requirements**:
- Define three plans:
  - **Free**: 1 user, 3 featuresets, 5 pipelines, shared data plane, community support
  - **Team** ($X/mo per seat): unlimited users, unlimited definitions, shared data plane, email support, SSO (Google/GitHub)
  - **Enterprise** (custom): dedicated data plane, SAML SSO, SLA, audit log retention, priority support
- Add a billing page at `/(app)/settings/billing`:
  - Current plan with usage summary
  - "Upgrade" / "Downgrade" buttons
  - Plan comparison table
  - Payment method management (integrate Stripe Elements or Stripe Checkout)
  - Invoice history with download links
- Add usage tracking display:
  - Seats used / limit
  - Featuresets / limit
  - Pipelines / limit
  - Events processed this month
  - Feature queries this month
- Show upgrade prompts when approaching or hitting limits (e.g., toast: "You've used 3/3 featuresets on the Free plan. Upgrade to add more.")
- Stripe webhook handling for subscription events (payment failed, subscription canceled, etc.)

**API surface needed** (control plane):
- `GET /api/v1/orgs/:slug/billing` — current plan, usage, limits
- `POST /api/v1/orgs/:slug/billing/checkout` — create Stripe checkout session
- `POST /api/v1/orgs/:slug/billing/portal` — create Stripe customer portal session
- `GET /api/v1/orgs/:slug/billing/invoices` — invoice history

**Files to create**: `app/(app)/settings/billing/page.tsx`, `components/billing/plan-card.tsx`, `components/billing/usage-meter.tsx`, `components/billing/upgrade-prompt.tsx`, `app/(app)/api/webhooks/stripe/route.ts`

---

### 5.3 — Usage Metering & Limits Enforcement

**Goal**: The frontend enforces plan limits gracefully — showing warnings as users approach limits and blocking actions that exceed them.

**Requirements**:
- Create a `usePlanLimits()` hook that fetches the org's current plan and usage from the control plane
- Before commit actions, check if the org is within limits; if not, show an upgrade modal instead of proceeding
- Add usage meters to the sidebar footer: compact bars showing seats, featuresets, pipelines used vs limit
- When a limit is reached:
  - Disable the relevant action button
  - Show a tooltip explaining the limit
  - Offer a one-click upgrade path
- On the billing page, show projected usage based on current growth rate

**Files to create**: `lib/hooks/use-plan-limits.ts`, `components/billing/limit-gate.tsx`, `components/billing/usage-sidebar-meters.tsx`

---

### 5.4 — Pricing & Marketing Pages

**Goal**: The public marketing site includes a pricing page that explains plans and drives conversion.

**Requirements**:
- Add a `/pricing` page with:
  - Three plan cards (Free, Team, Enterprise) with feature comparison matrix
  - "Get Started" CTA on Free (links to signup)
  - "Start Trial" CTA on Team (links to signup with trial flag)
  - "Contact Sales" CTA on Enterprise (links to contact form or Calendly)
  - FAQ section addressing common questions (data residency, SLA, security)
- Add pricing link to the landing page navbar
- Add a `/contact` page with a contact form for enterprise inquiries

**Files to create**: `app/pricing/page.tsx`, `app/contact/page.tsx`, `components/landing/pricing-table.tsx`, `components/landing/faq-section.tsx`

---

## Phase 6: Advanced Platform Features

Capabilities that differentiate Thyme as a production-grade platform for larger teams and more complex use cases.

### 6.1 — Feature Freshness & SLA Monitoring

**Goal**: Users can define freshness SLAs on featuresets and monitor whether features are being updated within expected timeframes.

**Requirements**:
- Add a "Freshness" indicator on featureset detail pages: time since last update for each feature
- Allow users to set a freshness SLA per featureset (e.g., "features must be updated within 5 minutes of event time")
- Show freshness status: green (within SLA), yellow (approaching SLA), red (SLA breached)
- Add a freshness overview to the dashboard: count of featuresets within SLA vs breaching
- Freshness breaches generate alerts (integrates with alerting system from 3.2)
- Add freshness trends chart: how freshness has tracked over time

**Files to create**: `components/catalog/freshness-indicator.tsx`, `components/catalog/freshness-sla-config.tsx`, `components/dashboard/freshness-overview.tsx`

---

### 6.2 — Feature Value Backfill Management

**Goal**: Users can trigger, monitor, and manage backfill jobs from the UI.

**Requirements**:
- Add a "Backfills" page at `/(app)/backfills` listing all backfill jobs with status (pending, running, completed, failed)
- Add a "Trigger Backfill" action on pipeline detail pages:
  - Select time range for backfill
  - Select target partitions (all or specific)
  - Show estimated duration and resource usage
  - Confirm and trigger
- Show backfill progress: percentage complete, events processed, estimated time remaining
- Show backfill history: when it ran, duration, events processed, success/failure

**API surface needed**:
- `POST /api/v1/backfills` — trigger backfill
- `GET /api/v1/backfills` — list backfills (already exists)
- `GET /api/v1/backfills/:id` — backfill status

**Files to create**: `app/(app)/backfills/page.tsx`, `components/backfill/backfill-list.tsx`, `components/backfill/trigger-backfill-modal.tsx`, `components/backfill/backfill-progress.tsx`

---

### 6.3 — Inspect Enhancements: Feature Playground

**Goal**: Enhance the inspect page into a full feature playground where users can explore feature values across entities, compare values, and test extractors.

**Requirements**:
- Add a "Bulk Query" mode: paste a list of entity IDs and fetch features for all of them in a table
- Add a "Time Travel" mode: query the same entity at multiple timestamps and show how feature values changed over time (line chart per feature)
- Add a "Compare Entities" mode: query two entity IDs side-by-side and highlight differences
- Add an "Extractor Debug" mode: show the extractor execution trace — which extractors ran, what inputs they received, what they returned, and timing
- Save and share inspect queries as bookmarkable URLs (query params in the URL)
- Add a "Recent Queries" section persisted in localStorage

**Files to modify**: `app/(app)/inspect/page.tsx`, `components/inspect/inspect-form.tsx`, `components/inspect/feature-viewer.tsx`
**Files to create**: `components/inspect/bulk-query.tsx`, `components/inspect/time-travel.tsx`, `components/inspect/entity-compare.tsx`, `components/inspect/extractor-trace.tsx`

---

### 6.4 — Custom Dashboards

**Goal**: Users can create custom dashboards with configurable widgets to monitor the metrics that matter to them.

**Requirements**:
- Add a "Dashboards" section at `/(app)/dashboards`
- Users can create named dashboards with a grid layout of widgets
- Widget types:
  - Metric chart (select pipeline + metric + time range)
  - Feature value display (entity ID + featureset)
  - Data quality gauge (dataset + expectation)
  - Pipeline status table (filtered list of pipelines)
  - Alert summary (active alerts by severity)
- Drag-and-drop widget placement and resizing (use react-grid-layout)
- Save dashboard configuration per user
- Share dashboards with team members (read-only link)

**Files to create**: `app/(app)/dashboards/page.tsx`, `app/(app)/dashboards/[id]/page.tsx`, `components/dashboards/dashboard-grid.tsx`, `components/dashboards/widget-picker.tsx`, `components/dashboards/widgets/*`

---

## Phase 7: Enterprise & Scale

Features required for enterprise adoption and operating at scale across large organizations.

### 7.1 — Multi-Region & Data Residency

**Goal**: Enterprise customers can choose the region where their data plane runs, with the UI reflecting region status and data residency.

**Requirements**:
- Add a region selector during org creation (e.g., US-East, US-West, EU-West, AP-Southeast)
- Show the active region in the org settings page
- Add region health indicators on the status page
- For orgs with multiple regions (enterprise), add a region switcher
- Show data residency compliance badge on the org settings page (e.g., "GDPR-compliant: data stored in EU-West")

**Files to create**: `components/settings/region-selector.tsx`, `components/status/region-status.tsx`

---

### 7.2 — SSO Directory Sync (SCIM)

**Goal**: Enterprise customers using SAML SSO can automatically sync their user directory to Thyme — users are provisioned/deprovisioned automatically.

**Requirements**:
- Add a "Directory Sync" section in org settings (enterprise plan only)
- Configure SCIM endpoint URL and bearer token
- Show sync status: last sync time, users synced, groups synced
- Map IdP groups to Thyme roles (e.g., "Engineering" -> member, "Platform Team" -> admin)
- Show synced users with a badge indicating they're managed by the IdP
- Prevent manual role changes for directory-synced users (controlled by IdP)

**Files to create**: `components/settings/directory-sync.tsx`, `app/(app)/settings/sso/page.tsx`

---

### 7.3 — Resource Quotas & Cost Attribution

**Goal**: Admins can set resource quotas per team or project and view cost attribution to understand which pipelines cost the most.

**Requirements**:
- Add a "Resource Management" page at `/(app)/settings/resources`
- Show resource usage breakdown:
  - Compute: CPU-hours per pipeline
  - Storage: RocksDB state size per pipeline
  - Throughput: events/sec per pipeline
  - Queries: feature queries per featureset
- Cost attribution: map resource usage to estimated cost (based on plan pricing)
- Top-N consumers: which pipelines/featuresets use the most resources
- Quotas (enterprise): set max pipelines, max partitions, max storage per team or project
- Show quota usage bars and warnings when approaching limits

**Files to create**: `app/(app)/settings/resources/page.tsx`, `components/settings/resource-breakdown.tsx`, `components/settings/cost-attribution-chart.tsx`, `components/settings/quota-config.tsx`

---

## Task Dependency Graph

```
Phase 1 (Foundation)
  1.1 Auth ─────────┐
  1.2 Org Model ────┼── All subsequent phases depend on these
  1.3 RBAC ─────────┤
  1.4 Onboarding ───┘

Phase 2 (Management)          Phase 3 (Observability)
  2.1 Definition CRUD           3.1 Pipeline Metrics
  2.2 Web Authoring             3.2 Alerting ──────────────── Phase 6.1 (Freshness SLA)
  2.3 Lineage Graph             3.3 Audit Log
  2.4 Quality Dashboard         3.4 System Status
  2.5 Search & Discovery

Phase 4 (Collaboration)       Phase 5 (Billing)
  4.1 Environments              5.1 Self-Service Signup
  4.2 API Keys                  5.2 Subscription Plans
  4.3 Activity Feed             5.3 Usage Metering
  4.4 Annotations               5.4 Pricing Page

Phase 6 (Advanced)            Phase 7 (Enterprise)
  6.1 Freshness SLA             7.1 Multi-Region
  6.2 Backfill Management       7.2 SCIM Directory Sync
  6.3 Feature Playground        7.3 Resource Quotas
  6.4 Custom Dashboards
```

**Recommended execution order**: Phase 1 (all) -> Phase 2.1, 2.5, 3.1, 3.4 (in parallel) -> Phase 4.1, 4.2, 5.1, 5.2 (in parallel) -> remaining tasks in priority order based on customer feedback.
