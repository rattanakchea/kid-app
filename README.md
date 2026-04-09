# Emoji Learning Flashcard Game for Kids

Production-minded build for a kid-friendly educational web app, developed in small safe increments.

## Operating Rules

- Prefer simple, maintainable architecture over cleverness.
- Make small, reviewable changes with git-friendly checkpoints.
- Update this README as the product and setup evolve.
- Log user prompts in `docs/prompt-updates.md`.

## Current Status

The repository baseline and MVP product definition are set up, the app includes flashcards and pair matching across several content packs, the iOS Capacitor shell is present, and the repo now follows a branch-based release model: `main` is the fuller product line and `free` is a slower-moving starter-edition branch with its own App Store identity.

## Product Direction

- The first product is a simple educational app for young kids, shipped on the web and prepared for an iOS release.
- The initial learning modes are flashcards and pair matching.
- The current launch packs are first words, animals, fruits, parts of body, shapes, and colors.
- `First Words` is flashcards-only for now and uses bundled in-app image cards instead of external URLs.
- One-time purchase support is being prepared for iOS, but premium UI remains disabled for the first release.
- `main` is the primary release line for the fuller catalog.
- `free` is a separate long-lived branch with a simpler starter catalog and its own App Store listing.

## Working Approach

1. Define the smallest production-capable slice.
2. Implement it with minimal moving parts.
3. Document the change and checkpoint it in git.
4. Repeat.

## Repository Layout

- `README.md`: project overview and setup notes.
- `docs/prompt-updates.md`: chronological log of user prompts and operating requests.
- `docs/architecture.md`: lightweight product and technical direction.
- `docs/mvp-spec.md`: one-page MVP definition for the first releasable version.
- `docs/release-hardening.md`: iOS release validation and App Store readiness checklist.
- `src/`: app source for the browser-first MVP.

## Stack

- Vite
- React
- TypeScript
- Capacitor iOS shell

This keeps the product simple, offline-friendly on iOS, and free of backend dependencies for the first release.

## Branch Release Model

The repo now uses one codebase with two release branches:

- `main`: primary product, updated regularly
- `free`: intentionally simpler public app, updated selectively from `main`

Operational rules:

- Build new features on `main`
- Update `free` only through cherry-picks or occasional controlled merges
- Keep branch differences concentrated in low-conflict files such as app identity, pack catalog, and App Store metadata
- Treat `free` as a curated downstream branch, not a mirror of `main`

See `docs/free-branch-release.md` for the exact workflow.

## Deployment

- GitHub repository: [rattanakchea/kid-app](https://github.com/rattanakchea/kid-app)
- Vercel project: `kid-games`
- The local repo is linked to Vercel through `.vercel/project.json`
- The GitHub repo is connected to the Vercel project for automatic deploys
- Pushing to the connected branch should trigger a new Vercel deployment

### Deployment Notes

- Vercel is configured with the `Vite` framework preset
- The Vercel project uses Node `24.x`
- `.vercel` is ignored in git and should remain local-only metadata
- The production branch should be confirmed in the Vercel dashboard, typically `main`

### GitHub To Vercel Commands

Use these commands to reproduce the current GitHub-connected Vercel setup:

```bash
# verify Vercel auth
npx vercel whoami

# link the local repo to the existing Vercel project
npx vercel link --project kid-games --yes

# connect the GitHub repo to the linked Vercel project
npx vercel git connect git@github.com:rattanakchea/kid-app.git
```

Use this command to trigger a new auto deployment after code changes:

```bash
git push origin main
```

### Package Scripts

The project also exposes manual Vercel deploy commands through `package.json`:

```bash
npm run deploy:preview
npm run deploy:prod
```

Use `deploy:preview` for an ad hoc preview deployment. Use `deploy:prod` only when you intentionally want a production deployment outside the normal GitHub push flow.

## Release Focus

- Keep `npm test` and `npm run build` green before native changes.
- Validate the iOS shell on simulator, real device, offline launch, and one archive build.
- Replace placeholder support/privacy details with production URLs and contact information before submission.
- Keep monetization UI hidden until post-launch feedback justifies activating it.
- Preserve the branch split: `main` carries the fuller product, while `free` stays intentionally simpler unless explicitly updated.

## Xcode

Install Xcode via Mac App Store.

Check the selected Xcode path and version:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
xcodebuild -version
```

Sync web assets into the native shell and open the project:

```bash
npm run cap:sync
npm run ios:open
```

Recommended validation order:

```bash
npm test
npm run build
npm run cap:sync
```

Then validate in Xcode:

- simulator launch
- real-device launch
- offline launch
- archive build
