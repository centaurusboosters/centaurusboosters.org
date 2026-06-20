#!/usr/bin/env bash
# Usage: scripts/notify.sh "Subject" "Body"
# Sends email to kurtharriger@gmail.com using local mail/sendmail if available.
# Falls back to logging only. Never depends on Claude.
SUBJECT=$(printf '%s' "${1:-Boosters agent notification}" | tr -d '\n\r')
BODY="${2:-No message body provided.}"
TO="kurtharriger@gmail.com"
LOG_FILE="${NOTIFY_LOG:-/tmp/boosters-notify.log}"
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) NOTIFY subject='$SUBJECT'" >> "$LOG_FILE"
if command -v mail &>/dev/null; then
  echo "$BODY" | mail -s "$SUBJECT" "$TO" 2>>"$LOG_FILE" && exit 0
fi
if command -v sendmail &>/dev/null; then
  printf "To: %s\nSubject: %s\n\n%s\n" "$TO" "$SUBJECT" "$BODY" | sendmail "$TO" 2>>"$LOG_FILE" && exit 0
fi
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) NOTIFY no mail transport available; logged only" >> "$LOG_FILE"
