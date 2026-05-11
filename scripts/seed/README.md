# Dev data seeding

`scripts/seed-dev.sh` populates the local Thyme stack with a curated
multi-domain catalog so you can iterate on the frontend (catalog tabs,
lineage graph, featureset detail) against realistic data.

## Quick start

```bash
# one-shot, idempotent
npm run seed:dev

# clean slate (drops all definitions, then re-seeds)
npm run seed:dev:reset

# auto-seed before `npm run dev` — opt in by exporting once
export THYME_AUTO_SEED=1
npm run dev
```

The seed registers ~6 featuresets, 6 datasets, 2 pipelines, and 4 sources
across three domains (commerce, content, identity). Extractors are stubs
returning constants — feature values are not exercised, so the **engine
does not need to be running**, only the definition service.

## Prerequisites

1. **Backend stack running locally** — definition service on `:8080`, Postgres
   on `:5433`. From `~/Projects/thyme`: `make infra && make run-definition-service`.
2. **thyme-sdk checked out** at `~/Projects/thyme-sdk` (or override with
   `THYME_SDK_PATH`). The SDK is on the `catalog_demo` branch — pull main
   once that lands.
3. **`thyme` CLI installed** in either:
   - Global Python: `pip install -e ~/Projects/thyme-sdk`
   - SDK venv: `cd ~/Projects/thyme-sdk && uv sync` (script auto-locates `.venv/bin/thyme`)
4. **`psycopg`** in whichever Python the script picks (only needed for
   `--reset`). The SDK venv has it.

The script fails loud with install hints if any of these are missing.

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `THYME_SDK_PATH` | `~/Projects/thyme-sdk` | Where to find the workspace file and venv |
| `DEFINITION_SERVICE_URL` | `http://localhost:8080` | Definition service base URL |
| `DATABASE_URL` | `postgres://thyme:thyme@localhost:5433/thyme` | Postgres connection (only used by `--reset`) |
| `SEED_RESET` | `0` | Set to `1` instead of passing `--reset` |
| `THYME_AUTO_SEED` | unset | Set to `1` to auto-seed before `npm run dev` |

## What gets seeded

| Domain | Featuresets | Highlight |
|---|---|---|
| commerce | `UserSpendFeatures`, `UserRiskFeatures` | Cross-featureset extractor dep (Risk → Spend) |
| content | `UserEngagementFeatures`, `UserEngagementFeaturesLegacy` | Deprecated featureset with `replacement` pointer |
| identity | `UserProfileFeatures`, `UserCompositeFeatures` | Cross-domain composite extractor (spans all 3 domains) |

The workspace itself lives at `~/Projects/thyme-sdk/examples/catalog_demo/workspace.py`.

## Visual verification checklist

After `npm run seed:dev`, open `http://localhost:3000/catalog`:

- [ ] **Featuresets tab** — 6 cards; `UserEngagementFeaturesLegacy` has a deprecated badge
- [ ] **Pipelines tab** — 2 cards (`compute_user_txn_stats`, `compute_user_engagement`)
- [ ] **Datasets tab** — 6 cards
- [ ] **Sources tab** — 4 cards: `postgres` ×3, `kinesis` ×1
- [ ] **Graph tab** — `UserCompositeFeatures` has incoming edges from all three domain featuresets
- [ ] **Featureset detail** for `UserEngagementFeaturesLegacy` — replacement points to `UserEngagementFeatures`
- [ ] Owner filter shows ≥5 distinct owners; tag filters reveal `domain`, `tier`, `pii` axes

## Idempotency

`thyme commit` upserts by `(name, version)`, so re-running `npm run seed:dev`
converges to the same state without duplicates. Use `npm run seed:dev:reset`
only when you rename or remove entities (commit alone won't delete old rows).

## Limitations

- Pipelines are registered but **not running** — there's no engine seed, so
  `thyme query` returns the stubbed extractor constants, not computed values.
- The `--reset` path only clears definition-side tables. Engine state
  (RocksDB, Kafka topics) is not touched; if the engine is running, restart
  it after a reset.
