# Agent Instructions

## Project Overview

Build a web application for guitar players that displays the seven diatonic chords for a selected key. When the user clicks a chord, the app should show the chord tones on a guitar fretboard and provide playable fingering/voicing candidates across the fretboard.

The target user is a guitarist who wants to quickly understand which chords belong to a key and how to play those chords on the guitar.

## Primary Goal

Implement a clean, usable MVP that allows the user to:

1. Select a musical key.
2. View the seven diatonic chords in that key.
3. Click a chord.
4. See the chord tones.
5. See all matching note positions on the guitar fretboard.
6. See multiple playable chord fingering candidates.

Prioritize correctness, clarity, and extensibility over visual complexity.

## Recommended Tech Stack

Use the following stack unless the existing repository already uses a different one:

- React
- TypeScript
- Vite
- CSS Modules or plain CSS
- No backend for the MVP
- No database for the MVP

The app should be deployable as a static web app to Vercel, Netlify, or GitHub Pages.

## Development Principles

### 1. Keep the music theory logic explicit

Do not hard-code every key manually. Implement reusable logic for:

- Major scale generation
- Diatonic triad generation
- Chord tone calculation
- Guitar fretboard note mapping
- Chord fingering candidate generation

It is acceptable to start with major keys only for the MVP, but the code should be structured so minor keys and seventh chords can be added later.

### 2. Separate domain logic from UI

Keep music theory and guitar logic outside React components where possible.

Suggested structure:

```text
src/
  domain/
    notes.ts
    scales.ts
    chords.ts
    guitar.ts
    voicings.ts
  components/
    KeySelector.tsx
    DiatonicChordList.tsx
    Fretboard.tsx
    ChordVoicingList.tsx
  App.tsx
```

### 3. Make the UI simple and readable

The MVP does not need fancy animation or advanced styling. It should be easy to read on both desktop and mobile.

Required UI sections:

- Key selector
- Diatonic chord list
- Selected chord details
- Fretboard diagram
- Chord fingering/voicing candidates

### 4. Favor deterministic behavior

Chord and fingering results should be stable between renders. Avoid random ordering unless explicitly requested.

### 5. Validate with tests where practical

Add unit tests for important domain logic if the project has a test setup. At minimum, make the logic easy to test.

Important examples:

- C major scale should be C D E F G A B.
- C major diatonic triads should be C, Dm, Em, F, G, Am, Bdim.
- A standard tuned guitar should map open strings as E A D G B E.
- A clicked C major chord should show C, E, and G positions on the fretboard.

## Guitar Assumptions

Use standard tuning by default:

```text
6th string: E2
5th string: A2
4th string: D3
3rd string: G3
2nd string: B3
1st string: E4
```

For the MVP, display frets 0 through 12 by default.

Later expansion may include:

- Custom tuning
- More frets
- Left-handed mode
- Capo support
- Alternate chord qualities
- Seventh chords
- Scale modes

## Chord Fingering Candidate Rules

For the MVP, generate practical voicing candidates using simple constraints:

- A candidate should include all required chord tones.
- A candidate may repeat chord tones.
- A candidate should use no more than 6 strings.
- A candidate should not span more than 4 or 5 frets, excluding open strings.
- Muted strings are allowed.
- Open strings are allowed.
- Prefer candidates with lower fret positions first.
- Prefer candidates that are easier to play.

Each candidate should include:

- String/fret positions
- Muted strings if applicable
- Chord tones included
- Optional difficulty score

Do not attempt to solve perfect human fingering in the MVP. Generate useful candidates, then sort them in a reasonable order.

## Accessibility

- Buttons must be keyboard accessible.
- Selected states should be visually clear.
- Do not rely only on color to convey note identity.
- Use readable labels for chord names and note names.

## Build and Deployment Requirements

The project should support:

```bash
npm install
npm run dev
npm run build
```

The production build should output a static app, typically to:

```text
dist/
```

If using Vite, keep the app compatible with Vercel using:

```text
Build command: npm run build
Output directory: dist
```

## README Requirements

Create or update `README.md` with:

- Project overview
- Local setup steps
- Development command
- Build command
- Deployment notes for Vercel
- Basic usage instructions

## Definition of Done

The MVP is complete when:

- The user can select a key.
- The app displays the seven diatonic chords for that key.
- The user can click a chord.
- The selected chord's tones are shown.
- The fretboard displays all matching chord-tone positions from fret 0 to 12.
- The app displays multiple chord fingering/voicing candidates.
- `npm run build` succeeds.
- The UI is usable on desktop and mobile.
- The implementation is organized and easy to extend.

## Things to Avoid

- Do not build a backend unless explicitly requested.
- Do not require user login.
- Do not use a database for the MVP.
- Do not hard-code all chord results for every key.
- Do not make the UI visually complex before the core logic works.
- Do not add paid services or external APIs unless necessary.
