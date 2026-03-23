# MVP Spec

## Product

Kid-friendly educational web app for ages 2 to 6 with simple, repeatable learning games.

## Goal

Ship a polished first version that proves parents will use and pay for a focused learning experience built around vocabulary practice.

## Target User

- Primary buyer: parents of kids ages 2 to 6
- Primary user: preschool and early kindergarten children

## Core Value

- simple educational screen time
- fast, repeatable learning loops
- clear themed content parents can trust

## MVP Scope

### Game Types

- Flashcards
- Pair matching

### Free Content

- Animals pack
- Fruits pack

### Premium Content Placeholder

- Colors pack
- Shapes pack
- Farm animals pack

Premium packs can remain locked in the MVP without full payment integration if needed for launch sequencing.

## Screens

1. Landing page
2. Game hub
3. Pack selection screen
4. Flashcard game screen
5. Pair matching game screen
6. Premium upsell screen

## Core User Flow

1. Parent opens the app.
2. Child chooses a content pack.
3. Child plays flashcards or pair matching.
4. Parent sees additional locked packs.
5. Parent is prompted to unlock premium content.

## Content Model

Each card should contain:

- `id`
- `pack`
- `word`
- `image`
- `audio`

Pair matching can reuse the same content entries from flashcards.

## Non-Goals For V1

- user accounts
- progress sync across devices
- multiplayer or classroom features
- complex adaptive learning
- admin CMS
- native iOS app
- subscription billing

## Monetization

Recommended first approach:

- free starter content
- one-time premium unlock later

This is simpler than recurring billing and maps well to future iOS in-app purchases.

## Technical Direction

- browser-first responsive web app
- TypeScript stack
- static JSON content for initial packs
- minimal or no backend for V1
- premium state can be mocked or locally stored until payments are added

## Build Order

### Week 1

- scaffold app
- define content schema
- implement game hub
- implement animals flashcards

### Week 2

- implement fruits flashcards
- implement pair matching
- add audio playback
- improve mobile UI

### Week 3

- add locked premium packs
- add premium upsell screen
- add basic analytics
- polish onboarding and navigation

## Launch Readiness

The MVP is launch-ready when:

- flashcards work smoothly on mobile
- pair matching is stable
- animals and fruits content feel polished
- premium packs are visible and understandable
- the app feels safe and simple for parents to hand to a child
