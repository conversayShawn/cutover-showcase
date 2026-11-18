# cutover-showcase

A minimal, sanitized Playwright + Checkly repo used to demonstrate two things
to prospects on camera:

1. **CI/CD pipeline integration** — every PR runs `npx checkly test --record`
   in GitHub Actions, posting a session link back on the PR.
2. **Merge blocking** — the Checkly check is a required status check on
   `main`, so a red run blocks merge.

This is a standalone repo (not a Cutover artifact) — the stand-in target is
the public `danube-web.shop` SPA, so there are no creds, no tenants, and
nothing specific to any prospect in here.

## What's in the box

- `tests/spa-journey.spec.ts` — six-step Playwright journey with two soft-nav
  assertions. Honors `DEMO_FAIL_MODE=true` by intercepting the SPA's JS bundle
  so the check fails at a named step (for Scene 3).
- `tests/login-page.spec.ts` — supporting signal.
- `src/__checks__/*.check.ts` — Checkly MaC constructs that wire the specs
  into BrowserChecks with the Jira-shaped webhook alert channel.
- `.github/workflows/checkly-pr.yml` — runs `checkly test --record` on PR.
- `.github/workflows/checkly-deploy.yml` — runs `checkly deploy --force` on
  push to `main`.

## One-time setup

### Repo

```bash
cd cutover-showcase
cp .env.example .env    # fill CHECKLY_API_KEY, CHECKLY_ACCOUNT_ID
npm install
npx playwright install chromium
```

Deploy the checks once from your laptop so they exist on the Checkly side:

```bash
npm run deploy
```

### GitHub

```bash
gh repo create cutover-showcase --private --source=. --remote=origin
git add . && git commit -m "Initial cutover showcase"
git push -u origin main
```

Add the GitHub Actions secrets:

```bash
gh secret set CHECKLY_API_KEY --body "$CHECKLY_API_KEY"
gh secret set CHECKLY_ACCOUNT_ID --body "$CHECKLY_ACCOUNT_ID"
```

Add the branch protection rule (Checkly as required status):

```bash
gh api -X PUT "repos/{owner}/{repo}/branches/main/protection" \
  --input branch-protection.json
```

Where `branch-protection.json` is:

```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Checkly test (record)"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null
}
```

The context name is the job name from `checkly-pr.yml` — if you rename the
job, update this too.

## Staging the demo video scenes

### Scene 2 (CI/CD pipeline)

1. Branch:
   ```bash
   git checkout -b demo/scene-2
   # trivial change: bump a comment in tests/spa-journey.spec.ts
   git commit -am "Demo: tweak comment"
   git push -u origin demo/scene-2
   gh pr create --fill
   ```
2. Watch the Actions run complete. The Checkly bot comments with a session
   link.
3. Capture the URLs for the `.env` of the video project:
   - `SHOWCASE_PR_URL` — the PR itself
   - `SHOWCASE_ACTIONS_URL` — the Actions run page
   - `CHECKLY_UI_SESSION_URL` — the session the comment links to
4. Leave this PR open and green for the recording.

### Scene 3 (merge blocking)

1. Flip the repo-wide variable so the deployed check fails:
   ```bash
   gh variable set DEMO_FAIL_MODE --body "true"
   ```
2. Push to `main` to redeploy with fail mode on (the deploy workflow handles
   it):
   ```bash
   git checkout main
   git commit --allow-empty -m "Flip fail mode on"
   git push
   ```
3. Open a second PR:
   ```bash
   git checkout -b demo/scene-3
   git commit --allow-empty -m "Demo: scene 3"
   git push -u origin demo/scene-3
   gh pr create --fill
   ```
4. The PR's Checkly job fails, merge is blocked. Capture:
   - `SHOWCASE_BRANCH_PROTECTION_URL` — from Settings → Branches → the rule
   - `SHOWCASE_FAILING_PR_URL` — this PR
   - `CHECKLY_UI_FAILED_RUN_URL` — the failed run on Checkly
5. **Before recording Scene 2 again:** flip fail mode off (`gh variable set
   DEMO_FAIL_MODE --body "false"` and push an empty commit to `main`).

## Keeping this repo clean

The repo is deliberately boring on camera:

- No Cutover branding anywhere (name is "cutover-showcase" but it's about the
  Pattern of showing Checkly in CI, not the prospect)
- No prospect data in `.env.example`, README, or comments
- The webhook URL in `.env.example` is the Checkly team's public webhook.site
  sample

If the prospect asks "can we see the repo?" the honest answer is "sure,
here's the sample repo I built this flow against" — nothing to redact.
