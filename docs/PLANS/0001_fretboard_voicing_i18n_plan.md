# 0001 Fretboard, Voicing, and i18n Plan

## Goal

Improve the fretboard display, chord voicing candidates, chord diagrams, and language switching.

## References

- Reference site: https://www.aki-f.com/chordbook/item.php?id=0_0
- The reference site separates chord shapes, chord tones, fretboard positions, and chord images.
- Treat the chord image as an intuitive vertical diagram that shows each string state, fretted positions, open strings, and muted strings.

## Scope

1. Reverse the displayed fretboard string order
   - Keep the internal standard tuning order as 6th string to 1st string.
   - Reverse only the visual fretboard order.
   - Display `1 E` at the top and `6 E` at the bottom.
   - Keep the voicing pattern order as 6th string to 1st string.

2. Show one representative chord form per position
   - The current `generateVoicings` function returns many candidates.
   - Keep full candidate generation available internally.
   - Add a selector that chooses the best-scored candidate for each position range.
   - Suggested ranges: open, 1-3, 4-6, 7-9, and 10-12.
   - Prefer open position first when available.

3. Add intuitive chord diagrams
   - Add a `ChordDiagram` component.
   - Show six vertical strings, fret lines, nut, finger dots, open `O`, and muted `X`.
   - Keep the text pattern, such as `x 3 2 0 1 0`, as supporting information.
   - Make root notes visually distinct from third and fifth notes.
   - Implement with stable responsive dimensions, using SVG or CSS grid.

4. Add Japanese and English language switching
   - Add a `LanguageSelector` component.
   - Store `language` state in `App`.
   - Centralize labels in `src/i18n.ts` or a similar module.
   - Replace the existing mojibake Japanese labels with valid UTF-8 strings.
   - Default language should be Japanese.
   - Optionally persist the selected language in `localStorage`.

## Implementation Steps

1. Domain cleanup
   - Keep `STANDARD_TUNING` in 6th-to-1st string order.
   - Add display-oriented string metadata, such as `getDisplayStrings()`.
   - Make the string order expectations explicit for `FretboardPosition` and `VoicingCandidate.states`.

2. Fretboard display
   - Update `Fretboard.tsx` so rendering uses 1st-to-6th string order.
   - Use display entries with `{ stringNumber, openNote }` to avoid lookup mistakes.
   - Move section labels and aria labels to i18n.

3. Representative voicing selection
   - Keep `generateVoicings()` as the full candidate generator.
   - Add `selectRepresentativeVoicingsByPosition(candidates)`.
   - Pick the lowest-score candidate in each position range.
   - Add unit tests for stable representative forms for chords such as C, G, and Am.

4. Chord diagram UI
   - Add `ChordDiagram.tsx`.
   - Render `ChordDiagram` inside each `ChordVoicingList` card.
   - Keep pattern, notes, position label, span, and difficulty as compact metadata.
   - Match the reference site's clarity without copying its image assets.

5. i18n
   - Add `ja` and `en` dictionaries in `src/i18n.ts`.
   - Localize quality labels, difficulty labels, position labels, section titles, and aria labels.
   - Add `LanguageSelector` to the control row.
   - Ensure all visible Japanese text is valid UTF-8.

6. Verification
   - Run `npm run test`.
   - Run `npm run build`.
   - Manually verify:
     - The fretboard top row is `1 E`.
     - The fretboard bottom row is `6 E`.
     - Voicing candidates show one representative per position.
     - Chord diagrams make forms like C `x 3 2 0 1 0` easy to understand.
     - Switching Japanese/English updates the main UI labels.

## Acceptance Criteria

- The fretboard displays `1 E` at the top and `6 E` at the bottom.
- Chord voicing candidates show only one representative form per position.
- Chord forms are displayed as intuitive diagrams similar in clarity to the reference site.
- The UI can switch between Japanese and English.
- Existing mojibake labels are fixed.
- `npm run test` passes.
- `npm run build` passes.

## Out of Scope

- Support for every chord type.
- Extended chords such as 7th, add9, and sus4.
- Copying or scraping image assets from the reference site.
- Left-handed display mode.
