# VendorGroupOS

VendorGroupOS is a local, testable operating-system prototype for VendorGroup's public-company website lifecycle. It includes simulated authentication, seeded client and project data, a lifecycle gate engine, request classification, launch controls, audit history, mock integrations, and a source-backed AI operations brief.

## Run Locally

```bash
npm install
npm run dev
```

Demo users are available in the role selector:

- Morgan Vale - Executive
- Avery Chen - Project Manager
- Priya Shah - QA Lead
- Read Only - Viewer

## Verification

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

The seeded journey uses Meridian Applied Robotics, Inc. `NASDAQ: MARX`, a fictional industrial automation company with corporate and investor-relations website records, missing onboarding assets, QA issues, integration states, work requests, launch authorization controls, and customer-success reviews.

## Architecture

- `src/domain` contains the state machine, gate evaluation, permissions, audit helpers, and request-classification rules.
- `src/data/seed.ts` creates the realistic simulated client environment.
- `src/services` contains persistence and mock AI generation adapters.
- `src/main.tsx` renders the accessible responsive operating surface.
- `src/test` covers lifecycle, classification, integration-style UI flow, and mobile overflow checks.

## Current Limitations

- Persistence uses `localStorage`, not SQLite or Prisma.
- AI is deterministic and local by design.
- Integrations are simulated adapter records.
- Accessibility checks include semantic/focus implementation and Playwright smoke coverage; a human WCAG review is still recommended before production.
- The visual system is tokenized in CSS but not yet extracted into a package.
