# 0002 Diatonic Chord Form Catalog Plan

## Goal

Add the chord forms shown for each diatonic chord in the reference major-key pages.

Reference: https://www.aki-f.com/chordbook/show.php?dia=0
Other keys use `dia=1` through `dia=11`.

## Chords To Show

| Degree | Role | Forms |
| --- | --- | --- |
| I | tonic | C, C6, Cmaj7 |
| IIm | subdominant substitute | Dm, Dm7 |
| IIIm | tonic substitute | Em, Em7 |
| IV | subdominant | F, F6, Fmaj7 |
| V | dominant | G, G7 |
| VIm | tonic substitute | Am, Am7 |
| VIIm-5 | dominant substitute | Bm7-5 |

## All Key Form Names

| Key | Forms |
| --- | --- |
| C | C, C6, Cmaj7, Dm, Dm7, Em, Em7, F, F6, Fmaj7, G, G7, Am, Am7, Bm7-5 |
| C#(D♭) | C#(D♭), C#(D♭)6, C#(D♭)maj7, D#(E♭)m, D#(E♭)m7, Fm, Fm7, F#(G♭), F#(G♭)6, F#(G♭)maj7, G#(A♭), G#(A♭)7, A#(B♭)m, A#(B♭)m7, Cm7-5 |
| D | D, D6, Dmaj7, Em, Em7, F#(G♭)m, F#(G♭)m7, G, G6, Gmaj7, A, A7, Bm, Bm7, C#(D♭)m7-5 |
| D#(E♭) | D#(E♭), D#(E♭)6, D#(E♭)maj7, Fm, Fm7, Gm, Gm7, G#(A♭), G#(A♭)6, G#(A♭)maj7, A#(B♭), A#(B♭)7, Cm, Cm7, Dm7-5 |
| E | E, E6, Emaj7, F#(G♭)m, F#(G♭)m7, G#(A♭)m, G#(A♭)m7, A, A6, Amaj7, B, B7, C#(D♭)m, C#(D♭)m7, D#(E♭)m7-5 |
| F | F, F6, Fmaj7, Gm, Gm7, Am, Am7, A#(B♭), A#(B♭)6, A#(B♭)maj7, C, C7, Dm, Dm7, Em7-5 |
| F#(G♭) | F#(G♭), F#(G♭)6, F#(G♭)maj7, G#(A♭)m, G#(A♭)m7, A#(B♭)m, A#(B♭)m7, B, B6, Bmaj7, C#(D♭), C#(D♭)7, D#(E♭)m, D#(E♭)m7, Fm7-5 |
| G | G, G6, Gmaj7, Am, Am7, Bm, Bm7, C, C6, Cmaj7, D, D7, Em, Em7, F#(G♭)m7-5 |
| G#(A♭) | G#(A♭), G#(A♭)6, G#(A♭)maj7, A#(B♭)m, A#(B♭)m7, Cm, Cm7, C#(D♭), C#(D♭)6, C#(D♭)maj7, D#(E♭), D#(E♭)7, Fm, Fm7, Gm7-5 |
| A | A, A6, Amaj7, Bm, Bm7, C#(D♭)m, C#(D♭)m7, D, D6, Dmaj7, E, E7, F#(G♭)m, F#(G♭)m7, G#(A♭)m7-5 |
| A#(B♭) | A#(B♭), A#(B♭)6, A#(B♭)maj7, Cm, Cm7, Dm, Dm7, D#(E♭), D#(E♭)6, D#(E♭)maj7, F, F7, Gm, Gm7, Am7-5 |
| B | B, B6, Bmaj7, C#(D♭)m, C#(D♭)m7, D#(E♭)m, D#(E♭)m7, E, E6, Emaj7, F#(G♭), F#(G♭)7, G#(A♭)m, G#(A♭)m7, A#(B♭)m7-5 |

## Source Link IDs

| Chord | Reference ID |
| --- | --- |
| C | `0_0` |
| C6 | `0_1` |
| Cmaj7 | `0_2` |
| Dm | `2_6` |
| Dm7 | `2_8` |
| Em | `4_6` |
| Em7 | `4_8` |
| F | `5_0` |
| F6 | `5_1` |
| Fmaj7 | `5_2` |
| G | `7_0` |
| G7 | `7_14` |
| Am | `9_6` |
| Am7 | `9_8` |
| Bm7-5 | `11_10` |

## Implementation Plan

1. Extend chord quality support
   - Add `major6`, `major7`, `minor7`, `dominant7`, and `minor7Flat5`.
   - Keep existing triad support.
   - Add tone intervals:
     - `major6`: 0, 4, 7, 9
     - `major7`: 0, 4, 7, 11
     - `minor7`: 0, 3, 7, 10
     - `dominant7`: 0, 4, 7, 10
     - `minor7Flat5`: 0, 3, 6, 10

2. Add per-degree form catalog
   - Create a data structure that maps each major-key degree to form qualities.
   - For C major it must produce:
     - `C, C6, Cmaj7`
     - `Dm, Dm7`
     - `Em, Em7`
     - `F, F6, Fmaj7`
     - `G, G7`
     - `Am, Am7`
     - `Bm7-5`
   - For other keys, transpose by degree root and keep the same form qualities.

3. Update UI
   - Keep the seven diatonic chord groups.
   - Show chord form buttons/cards inside each group.
   - Selecting a form updates chord tones, fretboard highlights, and voicing candidates.
   - Default selected form should be the basic triad for the degree.

4. Update voicing generation
   - Ensure `generateVoicings` accepts 3-note and 4-note chords.
   - Keep representative selection by position.
   - Prefer lower, playable forms first.

5. Tests
   - C major form catalog equals the table above.
   - Cmaj7 tones are `C, E, G, B`.
   - G7 tones are `G, B, D, F`.
   - Bm7-5 tones are `B, D, F, A`.
   - Existing triad tests still pass.

## Acceptance Criteria

- Each C major diatonic group shows the same chord form names as the reference page.
- Selecting each form recalculates tones and diagrams correctly.
- The implementation works for all supported keys by transposition.
- `npm run test` passes.
- `npm run build` passes.

## Out Of Scope

- Scraping or copying reference site images.
- Supporting all chordbook types beyond the listed diatonic forms.
- Minor-key diatonic catalogs.
