export const CHROMATIC_NOTES = [
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
] as const;

export type NoteName = (typeof CHROMATIC_NOTES)[number];
export type ChordQuality =
  | 'major'
  | 'minor'
  | 'diminished'
  | 'major6'
  | 'major7'
  | 'minor7'
  | 'dominant7'
  | 'minor7Flat5';
export type ChordToneRole = 'root' | 'third' | 'fifth' | 'sixth' | 'seventh';

const NOTE_DISPLAY_LABELS: Record<NoteName, string> = {
  C: 'C',
  'C#': 'C#(D♭)',
  D: 'D',
  'D#': 'D#(E♭)',
  E: 'E',
  F: 'F',
  'F#': 'F#(G♭)',
  G: 'G',
  'G#': 'G#(A♭)',
  A: 'A',
  'A#': 'A#(B♭)',
  B: 'B',
};

export function noteIndex(note: NoteName): number {
  return CHROMATIC_NOTES.indexOf(note);
}

export function transpose(note: NoteName, semitones: number): NoteName {
  return CHROMATIC_NOTES[(noteIndex(note) + semitones + 120) % 12];
}

export function getNoteDisplayLabel(note: NoteName): string {
  return NOTE_DISPLAY_LABELS[note];
}
