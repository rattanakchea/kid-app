# Architecture Notes

## Product Direction

The product direction is a kid-friendly educational web app that can later be wrapped for iOS distribution.

The first version should focus on:

- flashcard learning games
- themed content packs such as animals and fruits
- pair-matching games
- simple premium unlocks for additional content or features

## Technical Direction

- Default stack assumption: TypeScript across the stack.
- Favor a single deployable web app before introducing service decomposition.
- Start with a mobile-friendly browser experience first.
- Keep the MVP lightweight and low-ops, ideally with minimal backend requirements.
- Add auth, billing, analytics, and native wrappers only when the first product slice proves traction.

## Delivery Strategy

1. Foundation: repo hygiene, documentation, working agreements, and checkpoint discipline.
2. Runtime scaffold: initialize the app framework and developer tooling.
3. Product slice: build one narrow learning loop end to end.
4. Hardening: tests, observability, deployment, and operational safeguards.

## Checkpoint Convention

Each major step should leave the repo in a coherent state that can be committed independently.
