#!/usr/bin/env bash
# Site validation script — runs in CI and locally.
# Usage: bash scripts/validate-site.sh [html-file-or-site-dir]
set -euo pipefail

TARGET="${1:-.next/server/app/index.html}"
if [ -d "$TARGET" ]; then
  HTML="$TARGET/index.html"
else
  HTML="$TARGET"
fi
ERRORS=0

pass() { echo "PASS: $1"; }
fail() { echo "FAIL: $1"; ERRORS=$((ERRORS + 1)); }

echo "=== Validating site HTML: $HTML ==="
echo ""

# 1. HTML file must exist
if [ -f "$HTML" ]; then
  pass "index.html exists"
else
  fail "index.html missing at $HTML"
  echo "Cannot continue — index.html not found."
  exit 1
fi

# 2. HTML structure, duplicate IDs, and alt text (Python stdlib)
if python3 - "$HTML" << 'PYEOF'
import sys
from html.parser import HTMLParser

class SiteChecker(HTMLParser):
    def __init__(self):
        super().__init__()
        self.id_counts = {}
        self.imgs_without_alt = []
        self.has_title = False
        self.has_html_close = False
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a and a['id']:
            self.id_counts[a['id']] = self.id_counts.get(a['id'], 0) + 1
        if tag == 'img' and not a.get('alt', '').strip():
            self.imgs_without_alt.append(a.get('src', '(no src)')[:80])
        if tag == 'title':
            self.has_title = True
    def handle_endtag(self, tag):
        if tag == 'html':
            self.has_html_close = True

html = open(sys.argv[1]).read()
c = SiteChecker()
c.feed(html)
ok = True

dups = [k for k, v in c.id_counts.items() if v > 1]
if dups:
    print(f"FAIL: duplicate element IDs: {dups}")
    ok = False
else:
    print("PASS: no duplicate element IDs")

if c.imgs_without_alt:
    print(f"FAIL: images missing alt text: {c.imgs_without_alt}")
    ok = False
else:
    print("PASS: all images have alt text")

if not c.has_title:
    print("FAIL: missing <title> element")
    ok = False
else:
    print("PASS: <title> element present")

if not c.has_html_close:
    print("FAIL: HTML not properly closed (missing </html>)")
    ok = False
else:
    print("PASS: HTML properly closed")

sys.exit(0 if ok else 1)
PYEOF
then
  : # pass messages printed by python
else
  ERRORS=$((ERRORS + 1))
fi

# 3. No obvious placeholder text
if ! grep -qiE 'lorem ipsum|TODO[: ]|FIXME[: ]|\[INSERT [A-Z]\]|\[YOUR [A-Z]\]' "$HTML"; then
  pass "no placeholder text"
else
  fail "placeholder text found in $HTML (lorem ipsum / TODO / FIXME / [INSERT...])"
fi

# 4. No leaked local file paths
if ! grep -qE '/Users/[A-Za-z]|/home/[a-z]' "$HTML"; then
  pass "no local file paths"
else
  fail "local file path found in $HTML (/Users/... or /home/...)"
fi

# 5. No obvious secret patterns (tokens, webhook secrets)
# Looks for common credential assignment patterns; does not scan env vars
if ! grep -qiE "(ghp_[A-Za-z0-9]{36}|webhook[_-]secret\s*[:=]\s*[\"'][^\"']{8}|api[_-]?key\s*[:=]\s*[\"'][A-Za-z0-9._-]{16,})" "$HTML"; then
  pass "no obvious secrets in index.html"
else
  fail "possible secret/credential found in $HTML"
fi

# 6. Required sections — fail if a critical section disappears
# Checks for key landmark text that should always be present
CRITICAL_PATTERNS=("Centaurus" "booster" "golf")
for pattern in "${CRITICAL_PATTERNS[@]}"; do
  if grep -qiE "$pattern" "$HTML"; then
    pass "critical section present: $pattern"
  else
    fail "critical content missing from $HTML (expected match for: $pattern)"
  fi
done

echo ""
if [ "$ERRORS" -gt 0 ]; then
  echo "=== Validation FAILED: $ERRORS error(s). ==="
  exit 1
else
  echo "=== All checks passed. ==="
fi
