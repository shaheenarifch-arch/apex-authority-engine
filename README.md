# APEX Authority Engine

Daily, approval-first authority workflow for GetServices.ai, BLACK, ROMEO Studio, ATLAS AEO, and RELAY.

## What it does
- Selects one topic per product every day.
- Generates drafts through RAMBO when configured.
- Falls back to deterministic local drafts when RAMBO is unavailable.
- Adds FAQ content and Article/FAQ schema.
- Creates social and newsletter assets.
- Stores Markdown drafts in product-specific folders.
- Requires an explicit approval status before publishing.
- Publishes approved drafts through WordPress draft creation or a generic webhook.
- Produces generation manifests and authority summaries.

## Local setup
```powershell
Copy-Item .env.example .env
corepack enable
pnpm install
pnpm typecheck
pnpm test
pnpm daily
pnpm preview
```

Approve one site's drafts:
```powershell
.\scripts\approve.ps1 -Manifest .\.runtime\manifest-2026-10-25.json -Site getservices
```

Publish approved drafts:
```powershell
pnpm publish
```

## GitHub
Create a new repository named `apex-authority-engine`. Upload the **contents of this extracted folder**, not the ZIP itself. Add `RAMBO_URL` and `RAMBO_API_KEY` under GitHub repository Settings > Secrets and variables > Actions. The included workflow runs at 10:00 UTC and can also be launched manually.

## Safety and quality
- Default mode is draft-only.
- No unsupported statistics, customer claims, or endorsements should be published.
- WordPress posts are created as drafts.
- Social publishing is intentionally webhook-based so platform credentials remain outside this repository.
- Review all generated content before approval.
