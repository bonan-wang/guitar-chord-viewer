import { ChordQuality, NoteName, transpose } from './notes';
import { getMajorScale } from './scales';

export type DiatonicChord = {
  degree: number;
  romanNumeral: string;
  root: NoteName;
  quality: ChordQuality;
  symbol: string;
  tones: NoteName[];
};

const QUALITY_BY_DEGREE: ChordQuality[] = [
  'major',
  'minor',
  'minor',
  'major',
  'major',
  'minor',
  'diminished',
];

const ROMANS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];

const TONE_INTERVALS: Record<ChordQuality, number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
};

export function getChordTones(root: NoteName, quality: ChordQuality): NoteName[] {
  return TONE_INTERVALS[quality].map((interval) => transpose(root, interval));
}

export function getChordSymbol(root: NoteName, quality: ChordQuality): string {
  if (quality === 'minor') return `${root}m`;
  if (quality === 'diminished') return `${root}dim`;
  return root;
}

export function getMajorKeyDiatonicTriads(key: NoteName): DiatonicChord[] {
  return getMajorScale(key).map((root, index) => {
    const quality = QUALITY_BY_DEGREE[index];
    return {
      degree: index + 1,
      romanNumeral: ROMANS[index],
      root,
      quality,
      symbol: getChordSymbol(root, quality),
      tones: getChordTones(root, quality),
    };
  });
}
