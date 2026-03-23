# Architecture Notes

## Product Direction

The repository is currently empty, so the first goal is to establish a clean base for a SaaS product rather than guessing the final feature set.

## Technical Direction

- Default stack assumption: TypeScript across the stack.
- Favor a single deployable web app before introducing service decomposition.
- Add a database, auth, billing, background jobs, and analytics only when the first meaningful product slice needs them.

## Delivery Strategy

1. Foundation: repo hygiene, documentation, working agreements, and checkpoint discipline.
2. Runtime scaffold: initialize the app framework and developer tooling.
3. Product slice: build one narrow user flow end to end.
4. Hardening: tests, observability, deployment, and operational safeguards.

## Checkpoint Convention

Each major step should leave the repo in a coherent state that can be committed independently.
