# Flashcard Flip Upgrade

## Summary

Update the flashcard experience so the visual face is larger and the card itself flips on tap between a front face (image or emoji) and a back face (word plus pronunciation control). The interaction should feel like a physical kid flashcard, remain touch-friendly on mobile, and preserve the existing next/back/shuffle navigation.

## Key Changes

- Replace the current single-face flashcard body in [src/App.tsx](/Users/rattanakchea/Workspaces/kid-app/src/App.tsx) with a two-face card structure:
  - Front face: large `imageUrl` image when present, otherwise oversized emoji fallback.
  - Back face: word label and the existing pronunciation button.
- Add local flashcard face state:
  - Default each new card to the front/image face.
  - Tapping the card toggles front/back.
  - Changing cards via `Back`, `Next`, or `Shuffle` resets to the front face.
- Keep pronunciation behavior unchanged functionally:
  - Speech still uses `speechSynthesis`.
  - Ongoing speech should cancel when the card changes or view changes, as it does now.
  - The pronunciation button moves onto the text/back face only.
- Update [src/index.css](/Users/rattanakchea/Workspaces/kid-app/src/index.css) to support a real flip-card layout:
  - Increase the flashcard container height and available visual area.
  - Enlarge `.flashcard-image` significantly and enlarge emoji fallback so the front face feels dominant.
  - Introduce 3D flip styles using a card inner wrapper, `transform`, `perspective`, and `backface-visibility`.
  - Keep the animation short and readable, not fast or bouncy.
  - Preserve mobile responsiveness so the card still fits smaller screens without clipping.
- Keep progress text outside the flip faces or in a stable card footer area so it does not “disappear” during the flip and does not compete with the back-face word.

## Test Plan

- Manual behavior checks:
  - Open a flashcard pack and confirm the card starts on the front/image face.
  - Tap the card and confirm it flips to the text side.
  - Tap again and confirm it flips back.
  - Use `Next`, `Back`, and `Shuffle` and confirm each new card resets to the front face.
  - Tap `Hear` on the back face and confirm pronunciation still works.
  - Navigate away or change cards during speech and confirm speech stops.
- Visual checks:
  - Confirm image/emoji is materially larger than before on desktop and mobile.
  - Confirm the flip animation is smooth and readable, with no mirrored text bleed-through.
  - Confirm the controls remain reachable and the card does not overflow narrow mobile widths.
- Regression check:
  - Run `npm run build` and ensure the app still builds cleanly aside from the existing local Node version warning.

## Assumptions

- Flip interaction is card tap, not a separate button.
- The back face contains the word and the `Hear` control.
- Existing content continues to rely mostly on emoji fallback until real `imageUrl` assets are added.
- No changes are needed to the pack data schema or navigation model for this feature.

# Colors Category Expansion

## Summary

Add a fully playable `Colors` category to both flashcards and pair matching, using inline SVG color swatches as the visual representation rather than emoji or CSS-only boxes. SVG is the cleanest fit here because color cards need a consistent, centered visual shape across browsers, and SVG keeps the color definition attached to each card instead of scattering it across stylesheet classes.

## Key Changes

- Extend the card model in [src/data/packs.ts](/Users/rattanakchea/Workspaces/kid-app/src/data/packs.ts) to support color metadata for the `Colors` pack:
  - Add a `swatch` field on cards with at least `fill` and optional `stroke`.
  - Keep existing `emoji` and `imageUrl` support unchanged for other packs.
- Populate the `colors` pack with a large common-color set and make it playable now:
  - Include core colors first: red, blue, yellow, green, orange, purple, pink, brown, black, white, gray, silver, gold.
  - Add common kid-recognizable extensions: cyan, teal, navy, lime, olive, maroon, beige, tan, peach, lavender, turquoise, indigo.
  - Give the pack both modes by leaving `modes` unset unless there is a reason to restrict it.
  - Set `locked` to false so it appears alongside the existing playable packs.
- Update the flashcard visual rendering in [src/App.tsx](/Users/rattanakchea/Workspaces/kid-app/src/App.tsx):
  - When a card has `swatch`, render a large SVG swatch on the front face instead of emoji/image.
  - Keep the current flip-card behavior: swatch on front, word plus `Hear` on back.
  - Use a visible border or outline for very light colors like white, beige, or silver so the swatch does not disappear into the card background.
- Update the home-card previews and pair-game tiles to support swatches:
  - In pack previews, render the same color swatch visual for `Colors` cards instead of relying on emoji.
  - In pair matching, render each color tile using the SVG swatch at the largest practical size within the tile, centered consistently.
  - Reuse the same swatch rendering path for flashcards, home previews, and match tiles so the visual treatment stays identical.
- Do not implement this with CSS class-per-color or emoji:
  - Avoid CSS-only color definitions because that spreads product content into styling rules and gets harder to maintain as the list grows.
  - Avoid emoji because many colors have no reliable emoji equivalent and browser rendering is inconsistent.

## Public Interfaces / Types

- Add to `Card`:
  - `swatch?: { fill: string; stroke?: string }`
- No other type or routing changes are needed.
- Existing cards without `swatch` continue to render through the current image/emoji path.

## Test Plan

- Data/rendering checks:
  - Confirm the `Colors` pack appears in the home grid and pack switcher as a playable category.
  - Confirm flashcards show a large centered swatch on the front and the color name on the back.
  - Confirm very light colors remain visible because of the outline treatment.
- Gameplay checks:
  - Confirm the `Colors` pack works in pair matching with 6 pairs and centered swatches.
  - Confirm shuffle, next/back, and flip behavior still work correctly in flashcards.
  - Confirm pronunciation still speaks the color names.
- Regression checks:
  - Confirm animals, fruits, and first words still render through their existing emoji/image paths.
  - Run `npm run build` and expect success aside from the existing local Node version warning.

## Assumptions

- `Colors` should be playable now, not kept locked.
- The implementation should prioritize a maintainable content model over the fastest one-off visual hack.
- The color list should be broad but limited to common, parent-friendly names rather than niche design-system names.
- SVG swatches should be simple geometric shapes with optional border styling, not illustrative assets.

## Custom Flashcard Plan

Add a built-in `Custom Flashcards` category that lets the user create personal flashcards by uploading a photo and entering a label such as `table`. In v1, custom cards are stored only on the current device, are available in flashcard mode only, and support add plus delete actions. The custom pack should behave like a normal home-screen category so the feature is easy to discover.

## Key Changes

- Add a local-only custom pack layer on top of the existing static `packs` data.
  - Keep built-in packs unchanged.
  - Introduce a persisted `customCards` collection in `localStorage`.
  - Derive a synthetic `custom` pack at runtime with title `Custom Flashcards`, a short description, and cards from storage.
- Extend the card model for user-created cards.
  - Add a stable `id` generated on creation.
  - Add `imageUrl` support for uploaded photos stored as a data URL.
  - Add a marker such as `source?: "builtin" | "custom"` only if needed to simplify delete behavior.
  - Keep `emoji` required for built-in cards, but allow custom cards to use a simple fallback emoji like `🖼️` when an uploaded image is present.
- Add a creation flow inside the custom pack.
  - The custom pack appears on the home grid in flashcard mode like any other category.
  - Opening the custom pack shows:
    - the normal flashcard player when cards exist
    - an empty state when no cards exist
    - an `Add flashcard` action
  - The add flow collects:
    - one image file from the device
    - one required text label
  - On save, create a custom card, persist it, refresh the custom pack, and open that new card.
- Add simple management for v1.
  - Allow deleting a custom card from the custom pack detail screen.
  - No in-place edit flow in v1.
  - No custom cards in pair matching.
- Add validation and guardrails.
  - Require both image and text before saving.
  - Trim text input and reject empty labels.
  - Limit uploads to common image types supported by browser file inputs.
  - If the custom pack has fewer than one card, show the empty-state add prompt instead of the player.
  - If speech synthesis is available, custom labels should pronounce the entered text just like built-in cards.

## Public Interfaces / Types

- Add a persisted custom-card type, either by extending `Card` or with a small companion type:
  - `id: string`
  - `name: string`
  - `imageUrl: string`
  - optional source marker for custom-only actions
- Add a storage key for custom flashcards in `localStorage`.
- Add a small helper layer for:
  - loading custom cards
  - saving a new custom card
  - deleting a custom card
  - deriving the runtime custom pack
- No backend, sync, or account interfaces in v1.

## Test Plan

- Creation flow:
  - Add a custom flashcard with image + text and confirm it appears in the custom pack.
  - Confirm the new card persists after reload.
  - Confirm save is blocked when image or text is missing.
- Flashcard behavior:
  - Confirm custom cards flip, pronounce, and navigate like built-in flashcards.
  - Confirm the custom pack is visible on the home screen in flashcard mode.
  - Confirm the custom pack does not appear in pair-game mode.
- Management:
  - Delete a custom card and confirm it disappears immediately and stays deleted after reload.
  - Confirm the empty state appears when the last custom card is removed.
- Regression:
  - Built-in packs still render and behave the same.
  - Premium UI remains inactive.
  - Pair matching still uses only built-in packs.

## Assumptions

- V1 storage is this-device-only via `localStorage`.
- V1 scope is add plus delete, not edit.
- The custom pack is always visible on the flashcards home screen so users can add their first card.
- Uploaded images are stored locally as data URLs rather than uploaded to a server.
- Custom cards are excluded from pair matching in v1 even if enough cards exist.
