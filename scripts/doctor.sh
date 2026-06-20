#!/usr/bin/env bash
# doctor.sh — pre-run health check for the Boosters webhook runner
# Prints PASS/FAIL for each check. Exits 1 if any required check fails.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUNNER_DIR="$REPO_ROOT/automation/webhook-runner"

PASS=0
FAIL=0
WARNINGS=0

pass() {
  echo "  PASS  $1"
  PASS=$((PASS + 1))
}

fail() {
  echo "  FAIL  $1"
  FAIL=$((FAIL + 1))
}

warn() {
  echo "  WARN  $1"
  WARNINGS=$((WARNINGS + 1))
}

echo "========================================"
echo "  Boosters Webhook Runner Doctor Check"
echo "========================================"
echo ""

# 1. gh is present and authenticated
echo "[1] gh CLI present and authenticated"
if command -v gh &>/dev/null; then
  if gh auth status &>/dev/null 2>&1; then
    pass "gh is installed and authenticated"
  else
    fail "gh is installed but NOT authenticated (run: gh auth login)"
  fi
else
  fail "gh CLI not found in PATH"
fi

# 2. claude is present in PATH
echo "[2] claude CLI present"
if command -v claude &>/dev/null; then
  pass "claude is installed: $(command -v claude)"
else
  fail "claude CLI not found in PATH"
fi

# 3. node is present and version >= 20
echo "[3] node present and version >= 20"
if command -v node &>/dev/null; then
  NODE_VERSION=$(node --version | sed 's/v//')
  NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
  if [ "$NODE_MAJOR" -ge 20 ]; then
    pass "node v${NODE_VERSION} (>= 20)"
  else
    fail "node v${NODE_VERSION} is below required v20"
  fi
else
  fail "node not found in PATH"
fi

# 4. npm is present
echo "[4] npm present"
if command -v npm &>/dev/null; then
  pass "npm is installed: $(npm --version)"
else
  fail "npm not found in PATH"
fi

# 5. WEBHOOK_SECRET env var is set
echo "[5] WEBHOOK_SECRET environment variable set"
if [ -n "${WEBHOOK_SECRET:-}" ]; then
  pass "WEBHOOK_SECRET is set (value not logged)"
else
  fail "WEBHOOK_SECRET is not set (required)"
fi

# 6. kurtharriger/2026-boosters repo is accessible
echo "[6] GitHub repo kurtharriger/2026-boosters accessible"
if gh repo view kurtharriger/2026-boosters &>/dev/null 2>&1; then
  pass "kurtharriger/2026-boosters is accessible"
else
  fail "Cannot access kurtharriger/2026-boosters (check gh auth and repo permissions)"
fi

# 7. Required labels exist in the repo
echo "[7] Required labels exist in kurtharriger/2026-boosters"
REQUIRED_LABELS=("source:google-form" "agent:eligible" "agent:generated" "needs:human-input")
LABELS_OK=true
for label in "${REQUIRED_LABELS[@]}"; do
  if gh label list --repo kurtharriger/2026-boosters 2>/dev/null | grep -qF "$label"; then
    pass "Label exists: '$label'"
  else
    fail "Label missing: '$label' (create with: gh label create '$label' --repo kurtharriger/2026-boosters)"
    LABELS_OK=false
  fi
done

# 8. main branch protection is enabled
echo "[8] main branch protection enabled"
HTTP_STATUS=$(gh api repos/kurtharriger/2026-boosters/branches/main/protection \
  --silent --include 2>/dev/null | head -1 | awk '{print $2}' || echo "000")
if [ "$HTTP_STATUS" = "200" ]; then
  pass "main branch protection is configured"
elif [ "$HTTP_STATUS" = "404" ]; then
  warn "main branch protection is NOT enabled (recommended: enable in GitHub repo settings)"
else
  warn "Could not determine branch protection status (HTTP $HTTP_STATUS)"
fi

# 9. webhook-runner dist/index.js exists
echo "[9] webhook-runner built binary exists"
if [ -f "$RUNNER_DIR/dist/index.js" ]; then
  pass "dist/index.js exists at $RUNNER_DIR/dist/index.js"
else
  fail "dist/index.js not found — run: cd $RUNNER_DIR && npm install && npm run build"
fi

# 10. DB directory is writable
echo "[10] DB directory is writable"
DB_DIR="$RUNNER_DIR/db"
mkdir -p "$DB_DIR" 2>/dev/null || true
if [ -w "$DB_DIR" ]; then
  pass "DB directory is writable: $DB_DIR"
else
  fail "DB directory is NOT writable: $DB_DIR"
fi

echo ""
echo "========================================"
echo "  Results: ${PASS} PASS, ${FAIL} FAIL, ${WARNINGS} WARN"
echo "========================================"

if [ "$FAIL" -gt 0 ]; then
  echo "  Some checks FAILED. Fix the issues above before starting the service."
  exit 1
else
  echo "  All required checks passed."
  if [ "$WARNINGS" -gt 0 ]; then
    echo "  Review warnings above (non-blocking)."
  fi
  exit 0
fi
