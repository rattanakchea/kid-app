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
