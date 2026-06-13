# 0003 Reference Voicings and Layout Plan

## Goal

Revise the app so each chord form uses candidates derived from a-ki's factory chord pages, and improve the page layout for faster scanning.

Primary reference: https://www.aki-f.com/chordbook/item.php?id=0_0

## Requirements

1. Add chord form candidates based on the reference site
   - Use each chord form page, such as `item.php?id=0_0`, as the source for candidate diagrams.
   - For C, the page exposes candidate pages/images like:
     - `item.php?id=0_0_1`
     - `item.php?id=0_0_2`
     - `item.php?id=0_0_3`
     - `item.php?id=0_0_4`
   - Apply the same rule to all form IDs from PLAN0002.
   - Inspect the reference diagrams and enter the chord forms into the app as local structured data:
     - chord ID
     - pattern from 6th string to 1st string
     - fret range
     - muted/open/fretted string states
   - The app must render its own diagrams from local data.
   - Do not hotlink, copy image assets, or send users to the reference site for normal app use.

2. Make the fretboard panel collapsible
   - Default state: collapsed on smaller screens, expanded on desktop if space allows.
   - Keep selected chord tones visible in the detail panel even when collapsed.
   - Persist open/closed state in component state only.

3. Rework the page layout
   - Make the diatonic chord selector panel wide.
   - In each degree group, split every chord form into its own button.
   - Example for C major:
     - I group buttons: `C`, `C6`, `Cmaj7`
     - IIm group buttons: `Dm`, `Dm7`
   - Make the degree / quality / chord tones detail panel wide and compact.
   - Use this page order: 1 header/controls, 2 chord selector, 4 chord candidates, 3 selected detail, 5 fretboard.
   - Put voicing candidates before the selected detail panel.
   - Keep the page usable on mobile with a single-column stack.

## Numbered Layout Image

See: `docs/PLANS/ACTIVE/0003_layout_wireframe.svg`

Panel numbers:

1. Header and controls
2. Wide diatonic chord / form selector with separate buttons per form
3. Wide selected chord detail
4. Built-in chord candidates copied into local data from the reference diagrams
5. Collapsible fretboard panel

## Implementation Plan

1. Add local voicing data model
   - Add `ReferenceVoicingCandidate`.
   - Keep generated candidates as fallback.
   - Keep source IDs only as developer-facing traceability, not as user-facing links.

2. Add extraction workflow
   - Use PLAN0002 source IDs to open each reference page during development.
   - Read each displayed chord diagram and convert it into local `pattern` data.
   - Commit the converted chord forms so the runtime app does not fetch the reference site.

3. Add local candidate data
   - Store curated reference candidates in `src/domain/referenceVoicings.ts`.
   - Map by chord symbol or stable form key.
   - Return reference candidates first, generated candidates second only when missing.

4. Update UI layout
   - Update `App.tsx` section order.
   - Use the panel order `1, 2, 4, 3, 5`.
   - Keep selector, candidates, and detail panels wide.
   - Keep the fretboard last because it is optional/collapsible.

5. Add collapsible fretboard
   - Add a simple toggle button to the fretboard panel header.
   - Hide/show only the fretboard body.
   - Keep aria-expanded and aria-controls.

6. Tests
   - Reference candidate lookup returns C candidates for `0_0`.
   - Missing reference data falls back to generated candidates.
   - Collapsible panel renders closed and open states.
   - Build passes.

## Acceptance Criteria

- Chord candidates are built into the app as local data derived from a-ki's factory pages.
- Users can view and use the chord forms inside this app without opening the reference site.
- Fretboard panel can be collapsed and expanded.
- Each chord form in a degree group is a separate selectable button.
- Page panels are ordered `1, 2, 4, 3, 5`.
- Top selector and selected detail panels are wide and easy to scan.
- `npm run test` passes.
- `npm run build` passes.

## Out Of Scope

- Copying or hotlinking reference site chord images.
- Building an automated scraper that runs in the browser at runtime.
- Supporting chord types outside PLAN0002.
