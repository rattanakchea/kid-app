# Free Branch Release Workflow

This document defines how the repo manages the long-lived `free` branch.

## Purpose

- `main` is the primary product branch and carries the fuller catalog.
- `free` is a slower-moving starter-edition branch with its own App Store listing.
- `free` is intentionally simpler and should not auto-track every change from `main`.

## Branch Identity

- Branch name: `free`
- App name: `Emoji Learning Flashcard Game Free`
- Bundle ID: `com.rattanakchea.kidgames.free`
- App Store Connect: separate app record from `main`

## Product Shape

- Keep only the starter packs in `free`
- Avoid premium unlock UI in `free` unless the product strategy changes later
- Keep the same core learning loops where possible:
  - flashcards
  - pair games

## Update Workflow

1. Build and stabilize features on `main`
2. Decide which commits belong in `free`
3. Switch to `free`
4. Cherry-pick the selected `main` commits
5. Re-apply any `free`-specific identity or catalog differences if needed
6. Run `npm test` and `npm run build`
7. Run `npm run cap:sync`
8. Validate and archive the iOS build from the `free` branch

## Safety Rules

- Do not merge `main` into `free` by habit
- Do not develop general product features directly on `free`
- Keep branch-specific changes concentrated in:
  - `src/lib/appConfig.ts`
  - `src/data/packs.ts`
  - `docs/app-store-metadata.md`
  - native bundle/app name settings
