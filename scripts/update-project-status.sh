#!/usr/bin/env bash
# Update the GitHub Projects v2 Status field for a given issue.
# Usage: bash scripts/update-project-status.sh <issue-number> <status-name>
# Status names: New | Queued | Implementing | Needs Clarification |
#               Awaiting Review | Revision Requested | Failed | Complete
#
# Requires:
#   GITHUB_PROJECT_NUMBER environment variable set to your project number.
#   gh CLI authenticated with read:project + write:project scopes.
#   (Token must be added via: gh auth refresh -s read:project,write:project)
#
# If GITHUB_PROJECT_NUMBER is 0 or unset, exits 0 silently.
set -euo pipefail

ISSUE_NUMBER="${1:-}"
STATUS_NAME="${2:-}"
OWNER="kurtharriger"
REPO="2026-boosters"
PROJECT_NUMBER="${GITHUB_PROJECT_NUMBER:-0}"

if [ -z "$ISSUE_NUMBER" ] || [ -z "$STATUS_NAME" ]; then
  echo "Usage: $0 <issue-number> <status-name>" >&2
  exit 1
fi

if [ "$PROJECT_NUMBER" = "0" ] || [ -z "$PROJECT_NUMBER" ]; then
  echo "GITHUB_PROJECT_NUMBER not set — skipping Project status update."
  exit 0
fi

# Step 1: Get project node ID, status field ID, and option IDs
PROJECT_DATA=$(gh api graphql -f query="
{
  user(login: \"$OWNER\") {
    projectV2(number: $PROJECT_NUMBER) {
      id
      field(name: \"Status\") {
        ... on ProjectV2SingleSelectField {
          id
          options {
            id
            name
          }
        }
      }
    }
  }
}" 2>&1) || { echo "Failed to fetch project data: $PROJECT_DATA" >&2; exit 0; }

PROJECT_ID=$(echo "$PROJECT_DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['user']['projectV2']['id'])" 2>/dev/null) || { echo "Could not parse project ID — skipping status update." >&2; exit 0; }
FIELD_ID=$(echo "$PROJECT_DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['user']['projectV2']['field']['id'])" 2>/dev/null) || { echo "Could not parse field ID — skipping status update." >&2; exit 0; }
OPTION_ID=$(echo "$PROJECT_DATA" | python3 -c "
import sys, json
d = json.load(sys.stdin)
opts = d['data']['user']['projectV2']['field']['options']
target = sys.argv[1]
for o in opts:
    if o['name'].lower() == target.lower():
        print(o['id'])
        sys.exit(0)
sys.exit(1)
" "$STATUS_NAME" 2>/dev/null) || { echo "Status option '$STATUS_NAME' not found in project — skipping." >&2; exit 0; }

# Step 2: Get the project item ID for this issue
ITEM_DATA=$(gh api graphql -f query="
{
  repository(owner: \"$OWNER\", name: \"$REPO\") {
    issue(number: $ISSUE_NUMBER) {
      projectItems(first: 10) {
        nodes {
          id
          project { id }
        }
      }
    }
  }
}" 2>&1) || { echo "Failed to fetch issue project items: $ITEM_DATA" >&2; exit 0; }

ITEM_ID=$(echo "$ITEM_DATA" | python3 -c "
import sys, json
d = json.load(sys.stdin)
items = d['data']['repository']['issue']['projectItems']['nodes']
project_id = sys.argv[1]
for item in items:
    if item['project']['id'] == project_id:
        print(item['id'])
        sys.exit(0)
sys.exit(1)
" "$PROJECT_ID" 2>/dev/null) || { echo "Issue #$ISSUE_NUMBER not found in project $PROJECT_NUMBER — skipping status update." >&2; exit 0; }

# Step 3: Update the status field
gh api graphql -f query="
mutation {
  updateProjectV2ItemFieldValue(
    input: {
      projectId: \"$PROJECT_ID\"
      itemId: \"$ITEM_ID\"
      fieldId: \"$FIELD_ID\"
      value: { singleSelectOptionId: \"$OPTION_ID\" }
    }
  ) {
    projectV2Item { id }
  }
}" > /dev/null 2>&1 || { echo "Failed to update project status — skipping." >&2; exit 0; }

echo "Project Status → $STATUS_NAME (issue #$ISSUE_NUMBER)"
