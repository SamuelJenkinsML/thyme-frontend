#!/usr/bin/env bash
# Seed the local Thyme stack with the catalog_demo workspace so the frontend
# catalog/lineage UI has data to render. See scripts/seed/README.md.

set -euo pipefail

RESET=0
if [[ "${1:-}" == "--reset" || "${SEED_RESET:-0}" == "1" ]]; then
  RESET=1
fi

THYME_SDK_PATH="${THYME_SDK_PATH:-$HOME/Projects/thyme-sdk}"
DEFINITION_SERVICE_URL="${DEFINITION_SERVICE_URL:-http://localhost:8080}"
DATABASE_URL="${DATABASE_URL:-postgres://thyme:thyme@localhost:5433/thyme}"
WORKSPACE_REL="examples/catalog_demo/workspace.py"
WORKSPACE_PATH="$THYME_SDK_PATH/$WORKSPACE_REL"
EXPECTED_FEATURESETS=6

if [[ ! -d "$THYME_SDK_PATH" ]]; then
  echo "error: thyme-sdk not found at $THYME_SDK_PATH" >&2
  echo "       set THYME_SDK_PATH or clone it: git clone <thyme-sdk> $THYME_SDK_PATH" >&2
  exit 1
fi

if [[ ! -f "$WORKSPACE_PATH" ]]; then
  echo "error: workspace file missing: $WORKSPACE_PATH" >&2
  echo "       (expected to exist in thyme-sdk on the catalog_demo branch)" >&2
  exit 1
fi

# Resolve a thyme CLI invocation. Three fallbacks, in order of preference.
THYME_CMD=()
if command -v thyme >/dev/null 2>&1; then
  THYME_CMD=(thyme)
elif [[ -x "$THYME_SDK_PATH/.venv/bin/thyme" ]]; then
  THYME_CMD=("$THYME_SDK_PATH/.venv/bin/thyme")
elif [[ -x "$THYME_SDK_PATH/.venv/bin/python" ]]; then
  THYME_CMD=("$THYME_SDK_PATH/.venv/bin/python" -m thyme.cli)
else
  echo "error: cannot find a thyme CLI" >&2
  echo "       install it: cd $THYME_SDK_PATH && uv sync   (or: pip install -e .)" >&2
  exit 1
fi

PYTHON_CMD="${THYME_CMD[0]}"
if [[ "$PYTHON_CMD" != *"python"* ]]; then
  # Prefer the SDK venv's python for reset/verify if it exists, else system python3.
  if [[ -x "$THYME_SDK_PATH/.venv/bin/python" ]]; then
    PYTHON_CMD="$THYME_SDK_PATH/.venv/bin/python"
  elif command -v python3 >/dev/null 2>&1; then
    PYTHON_CMD="python3"
  else
    echo "error: no python interpreter found for verification step" >&2
    exit 1
  fi
fi

echo "==> Health-checking $DEFINITION_SERVICE_URL"
if ! curl -sf "$DEFINITION_SERVICE_URL/health" >/dev/null; then
  echo "error: definition service not reachable at $DEFINITION_SERVICE_URL" >&2
  echo "       start the backend stack first: cd ~/Projects/thyme && make infra && make run-definition-service" >&2
  exit 1
fi

if [[ $RESET -eq 1 ]]; then
  echo "==> Resetting Postgres workspace tables"
  "$PYTHON_CMD" - "$DATABASE_URL" <<'PY'
import sys
import psycopg

url = sys.argv[1]
with psycopg.connect(url) as conn:
    conn.execute(
        "DELETE FROM physical_assets; "
        "DELETE FROM service_events; "
        "DELETE FROM backfill_jobs; DELETE FROM jobs; DELETE FROM sources; DELETE FROM featuresets; "
        "DELETE FROM pipelines; DELETE FROM datasets; DELETE FROM graph_commits;"
    )
    conn.commit()
PY
fi

echo "==> Committing $WORKSPACE_REL"
"${THYME_CMD[@]}" commit "$WORKSPACE_PATH" --api-url "$DEFINITION_SERVICE_URL/api/v1/commit"

echo "==> Verifying"
COUNT=$("$PYTHON_CMD" - "$DEFINITION_SERVICE_URL" <<'PY'
import json
import sys
import urllib.request

url = sys.argv[1] + "/api/v1/featuresets"
with urllib.request.urlopen(url) as r:
    data = json.load(r)
print(len(data))
PY
)

if [[ "$COUNT" != "$EXPECTED_FEATURESETS" ]]; then
  echo "error: expected $EXPECTED_FEATURESETS featuresets, got $COUNT" >&2
  exit 1
fi

echo "==> Seeded $COUNT featuresets — http://localhost:3000/catalog"
