# Kid App

Production-minded SaaS startup build, developed in small safe increments.

## Operating Rules

- Prefer simple, maintainable architecture over cleverness.
- Make small, reviewable changes with git-friendly checkpoints.
- Update this README as the product and setup evolve.
- Log user prompts in `docs/prompt-updates.md`.

## Current Status

The repository baseline is set up, but the application has not been scaffolded yet.

## Initial Assumptions

- We will build a web-based SaaS product.
- We will optimize for a conventional full-stack TypeScript architecture unless the codebase later requires a different choice.
- We will add infrastructure only when it is justified by an immediate product need.

## Working Approach

1. Define the smallest production-capable slice.
2. Implement it with minimal moving parts.
3. Document the change and checkpoint it in git.
4. Repeat.

## Repository Layout

- `README.md`: project overview and setup notes.
- `docs/prompt-updates.md`: chronological log of user prompts and operating requests.
- `docs/architecture.md`: lightweight product and technical direction.

## Next Suggested Step

Scaffold the first application runtime and choose the initial product slice to build.
