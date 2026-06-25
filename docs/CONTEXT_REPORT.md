# VendorGroupOS Context Report

The supplied workspace did not contain a prior VendorOS master package. The attached brief was treated as the source of truth and preserved as product direction.

## Existing Package Inventory

- `outputs/` and `work/` existed as empty Codex folders.
- No application scaffold, prototypes, manifests, or master README were present.
- GitHub CLI was unavailable locally, so publishing uses standard `git`.

## Brand Reference

VendorGroup's live site presents a compliance-focused public-company service brand: restrained navigation, editorial typography, strong whitespace, white and near-black contrast, precise language, and emphasis on IR websites, newswire, managed hosting, SEC feeds, and confidence-building execution.

## Approved Decisions Carried Forward

- Private AI-native operating system for VendorGroup.
- Local simulated auth and role selection.
- Real state machine for the lifecycle.
- Mock integrations only; no production systems touched.
- Fictional public-company client: Meridian Applied Robotics, Inc. `NASDAQ: MARX`.
- Mock AI provider outputs are labeled and source-backed.

## Known Assumptions

- Local browser storage is the persistence adapter for this demonstration.
- Vite/React/TypeScript was selected because no existing stack was found and it keeps the demo runnable.
- External model, CMS, CRM, billing, hosting, and DNS integrations are isolated as mock records.
