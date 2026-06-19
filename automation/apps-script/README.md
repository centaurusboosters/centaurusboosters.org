# Apps Script: Form-to-GitHub-Issue Bridge

This script watches the Google Form response sheet and creates a GitHub issue for each approved submission.

---

## Google Form fields

Create a Google Form with these fields **in this exact order**:

| # | Field label | Type | Required |
|---|-------------|------|----------|
| 1 | Change type | Multiple choice: Text, Event, Link, Sponsor, Image, Correction, Other | Yes |
| 2 | Page or section | Short answer | Yes |
| 3 | Requested change | Paragraph | Yes |
| 4 | Assets | File upload | No |

Enable **"Collect email addresses"** (required) and **restrict form access** to specific people or your organization in the form settings. Access control is enforced at the form level — only authorized respondents can reach the form. The script records the respondent's signed-in email via `e.response.getRespondentEmail()` for the issue body.

Add a description to "Requested change" such as: *"Please be specific — include exact text, dates, URLs, image descriptions, or any other details the site editor will need."*

The response sheet columns will be:

```
A: Timestamp  B: Email Address  C: Change type  D: Page or section
E: Requested change  F: Assets
G: Status (written by script)  H: GitHub Issue #  I: GitHub Issue URL
```

Column B is populated automatically by Google Forms when email collection is enabled — it is not a form field.

---

## GitHub fine-grained personal access token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Click **Generate new token**
3. Set **Resource owner** to your account
4. Under **Repository access**, select **Only select repositories** → `kurtharriger/2026-boosters`
5. Under **Permissions → Repository permissions**, set **Issues** to **Read and write**
6. Generate the token and copy it immediately

---

## Step-by-step setup

### 1. Open Apps Script

In the Google Form's linked response spreadsheet:

1. Click **Extensions → Apps Script**
2. The script editor opens in a new tab

### 2. Paste the code

1. Delete any placeholder code in the editor
2. Copy the contents of `Code.gs` and paste them into the editor
3. Click **Save** (Ctrl/Cmd+S)

### 3. Store the GitHub token as a Script Property

Never paste the token into the source code.

1. In the Apps Script editor, click **Project Settings** (gear icon)
2. Scroll to **Script Properties**
3. Click **Add script property**
4. Set **Property** = `GITHUB_TOKEN`
5. Set **Value** = your fine-grained PAT
6. Click **Save script properties**

### 4. Install the trigger

1. In the Apps Script editor, click **Triggers** (clock icon)
2. Click **+ Add Trigger**
3. Configure:
   - **Function to run**: `onFormSubmit`
   - **Deployment**: `Head`
   - **Event source**: `From spreadsheet`
   - **Event type**: `On form submit`
4. Click **Save** and complete the Google authorization flow

---

## Testing

### Test 1: Allowlisted submitter

1. Submit the form from `kurtharriger@gmail.com`
2. Wait ~30 seconds for the trigger to fire
3. Check response sheet columns F, G, H:
   - **F (Status)**: `OK`
   - **G (Issue #)**: an integer
   - **H (Issue URL)**: `https://github.com/kurtharriger/2026-boosters/issues/N`
4. Verify the issue exists on GitHub with the correct title, body, and labels

---

## Troubleshooting

### View execution logs

Apps Script editor → **Executions** → click the most recent `onFormSubmit` run.

Common log messages:
- `Processing submission from: user@example.com (row 2)` — accepted
- `Rejected submission from: other@example.com` — not allowlisted
- `Created GitHub issue #42` — success
- `ERROR: GITHUB_TOKEN script property is not set` — repeat Step 3
- `GitHub API returned 401` — token invalid or expired

### Column F status values

| Status | Meaning |
|--------|---------|
| `OK` | Issue created |
| `ERROR — GITHUB_TOKEN script property is not set` | Token missing |
| `ERROR — HTTP 401: ...` | Token invalid or expired |
| `ERROR — HTTP 422: ...` | Label missing in repo |
| `ERROR — <message>` | Network or other error |

### Required GitHub labels

Create these in the repo before testing (Issues → Labels → New label), or the API returns HTTP 422:

- `source:google-form`
- `agent:eligible`
- `type:content`
- `type:correction`
- `type:event`
- `type:link`
- `type:sponsor`
- `type:image`
