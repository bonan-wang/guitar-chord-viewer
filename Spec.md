# Product Specification

## Product Name

Guitar Diatonic Chord Finder

## Summary

This web app helps guitar players explore the seven diatonic chords in a selected key and see how each chord can be played on the guitar. The default view shows a key selector and the seven diatonic chords for the selected key. Clicking a chord opens a detailed view with chord tones, fretboard positions, and playable chord fingering candidates.

## Target User

The main user is a guitar player who wants to:

- Learn the diatonic chords in a key.
- Understand the chord tones of each diatonic chord.
- Find where those notes exist on the guitar fretboard.
- Discover multiple ways to play a chord across different fret positions.

The app should be useful for songwriting, practice, music theory study, and fretboard visualization.

## MVP Scope

### Included in MVP

- Major keys
- Seven diatonic triads per key
- Standard guitar tuning
- Fretboard display from fret 0 to fret 12
- Chord tone highlighting
- Chord fingering/voicing candidates
- Static frontend-only app
- Desktop and mobile friendly layout

### Not Included in MVP

- User accounts
- Saving favorite chords
- Audio playback
- Custom tuning
- Capo support
- Minor-key mode
- Seventh chords
- Backend server
- Database

These may be added later.

## Core User Flow

1. User opens the app.
2. App defaults to C major.
3. App displays the seven diatonic chords for C major:

```text
C, Dm, Em, F, G, Am, Bdim
```

4. User changes the key using a key selector.
5. App updates the seven diatonic chords for the selected key.
6. User clicks a chord.
7. App displays:
   - Chord name
   - Chord quality
   - Chord tones
   - Chord degree in the key
   - Fretboard positions for the chord tones
   - Chord fingering/voicing candidates

## Functional Requirements

## 1. Key Selector

The app must provide a way to select a key.

### Supported MVP keys

Use the 12 chromatic roots:

```text
C, C#, D, D#, E, F, F#, G, G#, A, A#, B
```

Enharmonic flat support may be added later. For the MVP, sharps are acceptable.

### Default key

```text
C
```

### Behavior

When the user selects a key:

- The scale is recalculated.
- The seven diatonic chords are recalculated.
- The selected chord can either reset to the I chord or remain selected if the product design chooses to preserve the degree.

Recommended behavior:

- Preserve the selected degree if one is selected.
- Otherwise select the I chord by default.

## 2. Diatonic Chord List

The app must display seven diatonic triads for the selected major key.

### Major scale interval formula

```text
W W H W W W H
```

In semitones:

```text
2, 2, 1, 2, 2, 2, 1
```

### Major-key diatonic triad qualities

```text
I: major
ii: minor
iii: minor
IV: major
V: major
vi: minor
vii°: diminished
```

### Example: C major

```text
I: C
ii: Dm
iii: Em
IV: F
V: G
vi: Am
vii°: Bdim
```

### Example: G major

```text
I: G
ii: Am
iii: Bm
IV: C
V: D
vi: Em
vii°: F#dim
```

Each chord card/button should show:

- Degree
- Chord name
- Chord quality

## 3. Selected Chord Detail

When a chord is selected, display:

- Chord name
- Roman numeral degree
- Chord quality
- Chord tones

### Chord tone formulas

Use triads:

```text
major: root, major third, perfect fifth
minor: root, minor third, perfect fifth
diminished: root, minor third, diminished fifth
```

In semitones:

```text
major: 0, 4, 7
minor: 0, 3, 7
diminished: 0, 3, 6
```

### Example

For C major chord:

```text
Chord: C
Quality: major
Tones: C, E, G
```

For D minor chord:

```text
Chord: Dm
Quality: minor
Tones: D, F, A
```

## 4. Guitar Fretboard Display

The app must display a guitar fretboard with 6 strings and frets 0 through 12.

### Standard tuning

Use standard tuning from lowest string to highest string:

```text
6: E
5: A
4: D
3: G
2: B
1: E
```

### Fret mapping

For each string and fret, calculate the note name using chromatic semitone movement.

Example on the 6th string:

```text
Fret 0: E
Fret 1: F
Fret 2: F#
Fret 3: G
...
Fret 12: E
```

### Display behavior

When a chord is selected:

- Highlight every fretboard position whose note belongs to the selected chord tones.
- Show the note name inside or near the marker.
- Make root notes visually distinct from third and fifth notes.
- Do not rely only on color; include note labels.

### Fret range

MVP default:

```text
0 to 12
```

The implementation should allow this range to be extended later.

## 5. Chord Fingering / Voicing Candidates

The app must generate and display multiple possible ways to play the selected chord.

### Candidate format

Each voicing candidate should contain six string states, from 6th string to 1st string.

Each string state can be:

```ts
type StringState =
  | { type: 'muted' }
  | { type: 'played'; fret: number; note: string; chordTone: 'root' | 'third' | 'fifth' }
```

Example display format:

```text
x 3 2 0 1 0
```

For C major, this means:

```text
6th string: muted
5th string: fret 3
4th string: fret 2
3rd string: open
2nd string: fret 1
1st string: open
```

### Candidate generation constraints

A valid candidate should:

- Include all required chord tones.
- Use at least 3 played strings.
- Use no more than 6 played strings.
- Allow muted strings.
- Allow open strings.
- Have a maximum non-open fret span of 4 or 5 frets.
- Avoid impossible stretches where possible.

### Sorting

Sort candidates by practical playability:

1. Lower fret positions first.
2. Smaller fret span first.
3. More familiar open-position shapes when available.
4. Fewer muted middle strings preferred.
5. More complete voicings preferred.

The MVP does not need perfect human fingering. A simple scoring function is acceptable.

### Candidate display

Each candidate should show:

- Fret pattern, for example `x 3 2 0 1 0`
- Included notes, for example `C E G C E`
- Fret position label, for example `Open position`, `3rd position`, `5th position`
- Optional difficulty label, for example `Easy`, `Medium`, `Hard`

## Data Model Suggestions

### Note

```ts
type NoteName =
  | 'C'
  | 'C#'
  | 'D'
  | 'D#'
  | 'E'
  | 'F'
  | 'F#'
  | 'G'
  | 'G#'
  | 'A'
  | 'A#'
  | 'B'
```

### Chord Quality

```ts
type ChordQuality = 'major' | 'minor' | 'diminished'
```

### Diatonic Chord

```ts
type DiatonicChord = {
  degree: number
  romanNumeral: string
  root: NoteName
  quality: ChordQuality
  symbol: string
  tones: NoteName[]
}
```

### Fretboard Position

```ts
type FretboardPosition = {
  stringNumber: 1 | 2 | 3 | 4 | 5 | 6
  fret: number
  note: NoteName
}
```

### Voicing Candidate

```ts
type VoicingCandidate = {
  id: string
  pattern: Array<'x' | number>
  notes: NoteName[]
  minFret: number
  maxFret: number
  fretSpan: number
  difficulty: 'easy' | 'medium' | 'hard'
  score: number
}
```

## UI Layout

### Desktop layout

Recommended layout:

```text
Header
Key Selector
Diatonic Chord List
Selected Chord Detail
Fretboard
Voicing Candidates
```

### Mobile layout

Use a vertical layout:

```text
Header
Key Selector
Chord List
Selected Chord Detail
Fretboard
Voicing Candidates
```

Chord buttons should wrap nicely on small screens.

## Component Suggestions

### App

Responsible for:

- Selected key state
- Selected chord state
- Passing data to child components

### KeySelector

Props:

```ts
type KeySelectorProps = {
  selectedKey: NoteName
  onChange: (key: NoteName) => void
}
```

### DiatonicChordList

Props:

```ts
type DiatonicChordListProps = {
  chords: DiatonicChord[]
  selectedChordSymbol: string
  onSelectChord: (chord: DiatonicChord) => void
}
```

### ChordDetail

Props:

```ts
type ChordDetailProps = {
  chord: DiatonicChord
}
```

### Fretboard

Props:

```ts
type FretboardProps = {
  chordTones: NoteName[]
  root: NoteName
  startFret?: number
  endFret?: number
}
```

### ChordVoicingList

Props:

```ts
type ChordVoicingListProps = {
  candidates: VoicingCandidate[]
}
```

## Music Theory Logic Requirements

### Chromatic scale

Use sharps for MVP:

```ts
const CHROMATIC_NOTES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const
```

### Major scale generation

Function suggestion:

```ts
function getMajorScale(root: NoteName): NoteName[]
```

Example:

```ts
getMajorScale('C') // ['C', 'D', 'E', 'F', 'G', 'A', 'B']
getMajorScale('G') // ['G', 'A', 'B', 'C', 'D', 'E', 'F#']
```

### Diatonic triads

Function suggestion:

```ts
function getMajorKeyDiatonicTriads(key: NoteName): DiatonicChord[]
```

The function should use the scale and the fixed major-key triad quality pattern:

```ts
['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished']
```

### Chord symbols

Use the following symbol rules:

```text
major: root only, e.g. C
minor: root + m, e.g. Dm
diminished: root + dim, e.g. Bdim
```

## Acceptance Criteria

### Core functionality

- On first load, the app shows C major by default.
- The seven C major diatonic chords are shown correctly.
- Changing the key updates the chord list correctly.
- Clicking a chord updates the chord detail panel.
- Chord tones are calculated correctly.
- The fretboard highlights all positions matching the selected chord tones from fret 0 to 12.
- Root notes are distinguishable from other chord tones.
- Multiple voicing candidates are shown for the selected chord.

### Technical

- The app builds successfully with `npm run build`.
- TypeScript has no major type errors.
- The implementation is modular.
- The app does not require a backend.
- The app is deployable as a static site.

### Usability

- The app is understandable without reading documentation.
- Chord buttons are easy to click.
- Note labels are readable.
- The fretboard is usable on a laptop screen.
- The layout works on mobile width.

## Future Enhancements

Possible future features:

- Minor keys
- Natural minor, harmonic minor, melodic minor
- Seventh chords
- Scale mode display
- Custom tunings
- Capo support
- Audio playback
- Left-handed fretboard mode
- Flat note naming
- Enharmonic spelling based on key
- Favorite chord shapes
- Export chord diagrams as images
- Practice mode
- Songwriting progression suggestions

## Deployment Notes

The app should be deployable to Vercel with these settings:

```text
Framework preset: Vite
Install command: npm install
Build command: npm run build
Output directory: dist
```

No environment variables should be required for the MVP.

## README Usage Text Suggestion

The README should explain:

1. Install dependencies:

```bash
npm install
```

2. Run locally:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Deploy to Vercel:

```text
Import the GitHub repository into Vercel and use:
Build command: npm run build
Output directory: dist
```
