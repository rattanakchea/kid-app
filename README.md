# Kid App

Production-minded build for a kid-friendly educational web app, developed in small safe increments.

## Operating Rules

- Prefer simple, maintainable architecture over cleverness.
- Make small, reviewable changes with git-friendly checkpoints.
- Update this README as the product and setup evolve.
- Log user prompts in `docs/prompt-updates.md`.

## Current Status

The repository baseline and MVP product definition are set up, and the web app now includes both flashcards and an initial emoji-to-emoji pair-matching game.

## Product Direction

- The first product is a browser-first educational app for young kids.
- The initial learning modes are flashcards and pair matching.
- The first content packs are animals and fruits.
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

## Next Suggested Step

Add tap-to-hear pronunciation audio and polish feedback for successful matches.
