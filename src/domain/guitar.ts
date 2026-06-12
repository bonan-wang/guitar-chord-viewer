import { ChordToneRole, NoteName, transpose } from './notes';

export const STANDARD_TUNING: NoteName[] = ['E', 'A', 'D', 'G', 'B', 'E'];

export type FretboardPosition = {
  stringNumber: 1 | 2 | 3 | 4 | 5 | 6;
  stringLabel: string;
  fret: number;
  note: NoteName;
  chordTone?: ChordToneRole;
};

export function getNoteAtFret(openNote: NoteName, fret: number): NoteName {
  return transpose(openNote, fret);
}

export function getChordToneRole(
  note: NoteName,
  tones: NoteName[],
): ChordToneRole | undefined {
  const index = tones.indexOf(note);
  if (index === 0) return 'root';
  if (index === 1) return 'third';
  if (index === 2) return 'fifth';
  return undefined;
}

export function getFretboard(
  tones: NoteName[],
  startFret = 0,
  endFret = 12,
): FretboardPosition[] {
  return STANDARD_TUNING.flatMap((openNote, stringIndex) => {
    const stringNumber = (6 - stringIndex) as 1 | 2 | 3 | 4 | 5 | 6;
    return Array.from({ length: endFret - startFret + 1 }, (_, offset) => {
      const fret = startFret + offset;
      const note = getNoteAtFret(openNote, fret);
      return {
        stringNumber,
        stringLabel: openNote,
        fret,
        note,
        chordTone: getChordToneRole(note, tones),
      };
    });
  });
}
