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
export type ChordQuality = 'major' | 'minor' | 'diminished';
export type ChordToneRole = 'root' | 'third' | 'fifth';

export function noteIndex(note: NoteName): number {
  return CHROMATIC_NOTES.indexOf(note);
}

export function transpose(note: NoteName, semitones: number): NoteName {
  return CHROMATIC_NOTES[(noteIndex(note) + semitones + 120) % 12];
}
