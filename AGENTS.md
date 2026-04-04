# Repository Guidelines

## Project Structure & Module Organization

`src/` contains the web app. Keep UI in [`src/App.tsx`](/Users/rattanakchea/Workspaces/kid-app/src/App.tsx), shared data in `src/data/`, and runtime/config helpers in `src/lib/`. Tests live alongside the app entry points, with shared test setup in `src/test/setup.ts`. Static files for the Vite app belong in `public/`, while source design assets live in `assets/`. Product, release, and architecture notes belong in `docs/`.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the Vite dev server on the local network.
- `npm run build`: run TypeScript project builds, then produce the production bundle.
- `npm run preview`: serve the built app locally for a final smoke check.
- `npm test`: run the Vitest suite once in `jsdom`.
- `npm run test:watch`: run tests in watch mode while developing.
- `npm run cap:sync`: copy the built web assets into the iOS Capacitor shell.
- `npm run ios:open`: open the native iOS project in Xcode.

## Coding Style & Naming Conventions

Follow the existing TypeScript and React style: 2-space indentation, semicolons, and double quotes. Use `PascalCase` for React components and types, `camelCase` for variables, functions, and utility modules such as `appConfig.ts`, and lowercase kebab-case for docs files such as `release-hardening.md`. Keep changes small and prefer simple state flows over new abstractions.

## Testing Guidelines

Vitest and Testing Library are the current test stack. Add or update tests for any change that affects pack visibility, gameplay flow, premium gating, or browser APIs. Name test files `*.test.tsx` or `*.test.ts` near the feature they cover. Run `npm test` and `npm run build` before opening a PR; for native-impacting changes, also run `npm run cap:sync`.

## Commit & Pull Request Guidelines

Recent history favors short, imperative commit subjects, sometimes with a prefix such as `fix:` or `style:`. Keep commits focused and reviewable, for example `fix: keep premium UI disabled on launch`. PRs should explain user-visible changes, note test/build results, link the relevant issue or planning doc, and include screenshots when UI or App Store assets change.

## Documentation & Release Notes

Update `README.md` when setup or workflow changes. Log notable prompt or direction changes in `docs/prompt-updates.md`, and keep `docs/release-hardening.md` aligned with any iOS release-impacting work.
