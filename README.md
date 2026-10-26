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

## Layout

```
apps/worker/src/        daily.ts, preview.ts, publish-approved.ts, status.ts
packages/shared/        types and file helpers
packages/research/      TopicPlanner (topic + brief per site)
packages/intelligence/  RamboClient (RAMBO /v1/responses) and LocalDraftGenerator
packages/aeo/           FAQ section + Article/FAQPage JSON-LD
packages/content-engine/ Markdown front matter + social/newsletter assets
packages/distribution/  WordPress (draft) and webhook publishers
packages/analytics/     authority summary
config/sites.json       the five products
daily/topics.json       topic pool
scripts/approve.ps1     approve a site's drafts in a manifest
tests/                  vitest
```

## RAMBO wiring

`RAMBO_URL` is the RAMBO gateway, normally the BLACK gateway at `https://black.getservices.ai`
(or the rambo-router API server). `RAMBO_API_KEY` is that gateway's `BLACK_ACCESS_CODE`
(sent as `x-black-access`; also sent as `x-api-key` for the rambo-router server).
APEX asks for `taskType: seo_content` in `deep` mode, takes the JSON article out of the reply and
validates it. If RAMBO is not configured, or fails for a site, that site gets a local template draft;
the manifest records which (`generator: rambo | local`).

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
