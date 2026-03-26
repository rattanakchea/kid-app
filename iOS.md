Not ready for App Store submission yet.

This repo is still a web app deployed to Vercel, not an iOS app bundle. Based on the current codebase, the main gaps are:

No native iOS wrapper/project yet. You need an iOS shell such as Capacitor/WKWebView so you can produce an .ipa. Apple also requires apps that browse the web to use WebKit. App Review Guidelines 2.5.6
No App Store submission metadata/assets. You’ll need app name/subtitle, privacy policy URL, age rating, screenshots, app icon set, and release metadata in App Store Connect. Privacy policy URL is required for iOS apps, and screenshots are required. App information, Manage app privacy, Screenshot specifications
No declared privacy/App Privacy answers yet. Even if you collect little or no data, App Store Connect still requires privacy disclosures. App privacy details
If you want the Kids category, the app needs extra product changes. Apple says Kids Category apps must not include outbound links, purchase opportunities, or distractions accessible to kids unless behind a parental gate, and they should not include third-party analytics or third-party ads. App Review Guidelines 1.3
If you monetize premium content inside the iOS app, that unlock must use In-App Purchase. Your current repo only has placeholder premium direction, not StoreKit purchasing/restoration. App Review Guidelines 3.1.1, In-App Purchase
The product is still light for App Review risk. Apple rejects incomplete apps and low-functionality wrappers; a thin “just a website in a shell” submission is risky under completeness/minimum-functionality review. App Review Guidelines 2.1, 4.2
What needs to change

Add a native wrapper and iOS project.
Recommended: Capacitor with an embedded build of the app, not just a remote website.
Add App Store basics.
App icons, launch/splash handling, screenshots, privacy policy page, support URL, age rating.
Decide category strategy.
If you want “Kids Category,” add a parental gate around any future upsell/external links and avoid third-party analytics/ads.
Implement native-friendly monetization.
If premium packs are sold in-app on iOS, use StoreKit and add restore purchases.
Harden the app for review.
Offline/failure handling, no obvious placeholder flows, stable navigation, production QA on real iPhones, accessibility pass.
Prepare compliance/docs.
App Privacy answers, content rights for any images/audio, review notes, demo instructions if needed.
Current assessment

Ready for web deployment: yes.
Ready to be wrapped for TestFlight experimentation: almost, after adding a native shell.
Ready for App Store submission: no.
Biggest repo-specific gaps I see right now:

no iOS project/wrapper
no privacy policy URL or App Store metadata
no IAP implementation for premium content
no Kids-category safeguards
no analytics/privacy decision documented
no tests or App Review hardening
If you want, I can turn this into a concrete “web app to App Store” implementation plan for this repo, including the exact Capacitor, StoreKit, metadata, and Kids Category changes.

---

# Web App To App Store Plan

## Summary

Wrap the existing Vite/React app as a native iOS app with Capacitor, ship it in Apple’s Kids Category, and include a one-time premium unlock using StoreKit for locked packs. The release should be an embedded app bundle, not a remote website wrapper, with Kids Category safeguards, App Store metadata/compliance, and enough native hardening to pass App Review.

## Implementation Changes

### 1. Native shell and build pipeline

- Add Capacitor to the repo and treat the web build output as the source for the iOS app:
  - Install `@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`.
  - Add `capacitor.config.ts` with:
    - `appId`: reverse-DNS production id
    - `appName`: final App Store name
    - `webDir`: `dist`
    - `server`: omitted for production so iOS loads bundled assets only
    - `ios.contentInset`: `always`
- Add package scripts:
  - `build:ios`: web production build for native embedding
  - `cap:sync`: sync web assets/plugins to iOS
  - `ios:open`: open Xcode project
- Commit the native iOS project under `ios/App`.
- In Xcode:
  - Set deployment target to a current supported iOS baseline.
  - Set bundle identifier, team, signing, version, and build number.
  - Use `WKWebView` via Capacitor defaults.
  - Disable arbitrary remote navigation; keep app self-contained.
- Do not rely on Vercel hosting for the App Store binary. Vercel remains for web distribution only.

### 2. Product changes for iOS + Kids Category

- Restore the intended premium structure in app content:
  - Free starter packs remain playable.
  - Premium packs become visible but locked.
  - `Colors` can remain premium if that is the monetized pack set; if kept free on web, gate it only on iOS behind entitlement-aware config.
- Add a parent-facing premium flow:
  - Locked pack tap opens a premium upsell screen instead of silently hiding or bypassing access.
  - All purchase entry points must be behind a parental gate because the app is targeting Kids Category.
- Add a parental gate implementation:
  - Use a simple adult-only challenge before opening purchase UI, restore purchases, outbound links, or privacy-policy/support links.
  - Gate all external navigation, not just purchases.
- Keep the kid play loop distraction-free:
  - No third-party ads.
  - No social links, share flows, or external web browsing accessible to the child path.
  - No account creation required for core play.
- Add offline-safe behavior:
  - App should function for its bundled packs with no network.
  - Purchase status should restore correctly when network is available.

### 3. StoreKit premium unlock

- Use a non-consumable In-App Purchase for one-time premium access.
- Product model:
  - One SKU for “Premium Pack Unlock” covering all premium packs in v1.
  - Entitlement is local-first in the app state, but source of truth is StoreKit transaction/entitlement status.
- Native purchase integration:
  - Use a maintained Capacitor-compatible StoreKit bridge/plugin or a thin native Capacitor plugin if needed.
  - Expose JS methods for:
    - load products
    - purchase product
    - restore purchases
    - get current entitlement state
- App behavior:
  - On app launch, fetch current entitlements and unlock premium packs before rendering paywalled content.
  - Add a restore purchases action in a parent-only settings/upsell area.
  - Handle purchase success, cancellation, pending state, and failure without breaking navigation.
- Data/interface changes:
  - Add pack-level premium metadata such as `requiresPremium?: boolean`.
  - Add a small entitlement service in the app that maps StoreKit state to unlocked content.
  - Keep web fallback simple: local/mock premium state for web if needed, but iOS must prefer StoreKit entitlements.
- Do not implement subscriptions in v1.

### 4. Metadata, privacy, and App Store Connect

- Add repo-managed app assets and content needed for submission:
  - App icon source files and exported iOS icon set
  - Launch/splash artwork if needed by the native shell
  - Screenshots plan for required iPhone sizes
  - Privacy policy URL and support URL
- Create App Store Connect metadata:
  - App name, subtitle, description, keywords, promotional text
  - Age rating appropriate for preschool content
  - Kids Category primary/secondary selections if applicable
  - Review notes explaining offline educational content and purchase parental gate
- Complete App Privacy disclosures:
  - Decide and document exactly what data is collected.
  - Preferred v1 default: no third-party analytics, no advertising, minimal/no personal data collection.
  - Match the implementation exactly; do not declare “no data collected” if any SDK contradicts it.
- Add a privacy policy page/site and support page reachable from the parent area and App Store listing.
- Add copyright/licensing documentation for all bundled images, audio, and artwork.

### 5. App hardening and accessibility

- Add production hardening before submission:
  - Basic test coverage for pack selection, flashcard flow, pair matching, locked-pack gating, purchase gating, and restore path.
  - Real-device QA on recent iPhones.
  - Graceful handling for speech/audio unavailability.
  - Stable state restoration after app background/foreground.
- Add accessibility work needed for review and product quality:
  - VoiceOver labels for flashcards, swatches, controls, and locked packs.
  - Adequate contrast for light color swatches.
  - Parent-only controls clearly labeled.
- Remove or gate any unfinished/placeholder UI before submission.

## Public Interfaces / Types

- Add to pack model:
  - `requiresPremium?: boolean`
- Add app-level entitlement interface:
  - `hasPremiumAccess: boolean`
  - `purchasePremium(): Promise<PurchaseResult>`
  - `restorePremium(): Promise<RestoreResult>`
  - `refreshEntitlements(): Promise<boolean>`
- Add parental gate utility interface used before:
  - purchase
  - restore
  - external links
  - support/privacy navigation
- Keep existing card/game interfaces intact except where premium visibility depends on entitlement state.

## Test Plan

- Native/build checks:
  - Web build succeeds, Capacitor sync succeeds, Xcode archive builds successfully.
  - App launches from bundled assets with network disabled.
- Product flow checks:
  - Free packs playable without purchase.
  - Locked premium packs visible but blocked until purchase.
  - Parent gate appears before purchase, restore, privacy policy, or support links.
  - Successful purchase unlocks premium immediately.
  - Restore purchases re-unlocks premium on reinstall/new device.
- Kids Category checks:
  - No child-accessible outbound links without parental gate.
  - No third-party ads or third-party analytics SDKs.
  - No purchase prompts directly in the kid loop without adult verification.
- Review readiness checks:
  - App Store metadata complete.
  - Privacy disclosures match implementation.
  - Screenshots, icon, privacy policy URL, support URL, and review notes are ready.
- Regression checks:
  - Flashcards, pair matching, audio, swatches, and locked-pack UI still work on web and iOS.
  - Existing content packs still render correctly after premium gating changes.

## Assumptions

- The first App Store release targets Apple’s Kids Category.
- The first iOS release includes one non-consumable premium unlock.
- The App Store binary will embed local web assets via Capacitor and not depend on loading the live Vercel site.
- V1 should avoid third-party analytics and ads to simplify Kids Category compliance and privacy disclosures.
- Premium packs should be visible in the UI before purchase so the one-time unlock has a clear product surface.
