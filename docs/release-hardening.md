# Release Hardening Checklist

This document captures the current release posture for the first iOS launch of Emoji Learning Flashcard Game for Kids.

## Launch Position

- Ship a simple educational app first.
- Keep `premiumUiEnabled` disabled in the product UI.
- Keep StoreKit plumbing in place for a later release.
- Focus engineering time on native stability, App Review safety, and early tester feedback.

## Engineering Gates

- `npm test` passes.
- `npm run build` passes.
- `npm run cap:sync` passes.
- Local Node is upgraded to `20.19+` or `22.12+`.

## Native Validation Order

1. Open the native project with `npm run ios:open`.
2. Confirm the `App` target includes:
   - `BridgeViewController.swift`
   - `PremiumUnlockPlugin.swift`
3. Confirm signing values in Xcode:
   - team
   - bundle identifier
   - version
   - build number
   - deployment target
4. Run on an iPhone simulator.
5. Run on a real iPhone.
6. Launch once with network disabled and confirm bundled assets still load.
7. Create one archive build in Xcode.
8. Upload one build to App Store Connect or TestFlight.

## First-Session QA

- Home screen renders without layout breakage on iPhone.
- Flashcards flip reliably on tap.
- Flashcard audio works when supported and fails gracefully when unavailable.
- Pair matching remains centered and touch-friendly.
- Colors swatches remain visible, including light colors.
- No purchase, restore, or parent-gate UI is visible in the shipped flow.

## App Review / Kids Category Checks

- No third-party ads.
- No third-party analytics SDKs in the first release.
- No child-facing outbound links in the main play flow.
- Privacy and support pages use production HTTPS URLs before submission.
- App Store metadata does not promise purchase features that are not visible in the app.

## Metadata To Finalize

- App icon set
- iPhone screenshots
- subtitle
- description
- keywords
- review notes
- privacy policy URL
- support URL
- support email

## TestFlight Goal

- Ship to a very small parent tester group.
- Observe whether kids complete a session without help.
- Observe whether parents understand the value of flashcards plus pair matching.
- Collect bugs and confusion points before activating any monetization UI.
