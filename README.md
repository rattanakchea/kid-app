# Kid App

Production-minded build for a kid-friendly educational web app, developed in small safe increments.

## Operating Rules

- Prefer simple, maintainable architecture over cleverness.
- Make small, reviewable changes with git-friendly checkpoints.
- Update this README as the product and setup evolve.
- Log user prompts in `docs/prompt-updates.md`.

## Current Status

The repository baseline and MVP product definition are set up, the web app includes flashcards and an initial emoji-to-emoji pair-matching game, and selecting a home card now opens a dedicated detail page instead of keeping everything on one screen.

## Product Direction

- The first product is a browser-first educational app for young kids.
- The initial learning modes are flashcards and pair matching.
- The first content packs are first words, animals, and fruits.
- `First Words` is flashcards-only for now and uses bundled in-app image cards instead of external URLs.
- The monetization path is free starter content plus premium content unlocks.

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
- `src/`: app source for the browser-first MVP.

## Stack

- Vite
- React
- TypeScript

This is the simplest maintainable option for a browser-first MVP with no immediate backend requirements.

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

## Next Suggested Step

Add tap-to-hear pronunciation audio and polish feedback for successful matches.
