import { ChordQuality, getNoteDisplayLabel, NoteName, transpose } from './notes';
import { getMajorScale } from './scales';

export type DiatonicChord = {
  degree: number;
  romanNumeral: string;
  root: NoteName;
  quality: ChordQuality;
  symbol: string;
  tones: NoteName[];
};

export type DiatonicChordGroup = {
  degree: number;
  romanNumeral: string;
  role: 'tonic' | 'subdominantSubstitute' | 'tonicSubstitute' | 'subdominant' | 'dominant' | 'dominantSubstitute';
  forms: DiatonicChord[];
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
const REFERENCE_ROMANS = ['I', 'IIm', 'IIIm', 'IV', 'V', 'VIm', 'VIIm-5'];
const ROLE_BY_DEGREE: DiatonicChordGroup['role'][] = [
  'tonic',
  'subdominantSubstitute',
  'tonicSubstitute',
  'subdominant',
  'dominant',
  'tonicSubstitute',
  'dominantSubstitute',
];

const FORM_QUALITIES_BY_DEGREE: ChordQuality[][] = [
  ['major', 'major6', 'major7'],
  ['minor', 'minor7'],
  ['minor', 'minor7'],
  ['major', 'major6', 'major7'],
  ['major', 'dominant7'],
  ['minor', 'minor7'],
  ['minor7Flat5'],
];

const TONE_INTERVALS: Record<ChordQuality, number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  major6: [0, 4, 7, 9],
  major7: [0, 4, 7, 11],
  minor7: [0, 3, 7, 10],
  dominant7: [0, 4, 7, 10],
  minor7Flat5: [0, 3, 6, 10],
};

export function getChordTones(root: NoteName, quality: ChordQuality): NoteName[] {
  return TONE_INTERVALS[quality].map((interval) => transpose(root, interval));
}

export function getChordSymbol(root: NoteName, quality: ChordQuality): string {
  const label = getNoteDisplayLabel(root);
  if (quality === 'minor') return `${label}m`;
  if (quality === 'diminished') return `${label}dim`;
  if (quality === 'major6') return `${label}6`;
  if (quality === 'major7') return `${label}maj7`;
  if (quality === 'minor7') return `${label}m7`;
  if (quality === 'dominant7') return `${label}7`;
  if (quality === 'minor7Flat5') return `${label}m7-5`;
  return label;
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

export function getMajorKeyDiatonicChordGroups(key: NoteName): DiatonicChordGroup[] {
  return getMajorScale(key).map((root, index) => {
    const degree = index + 1;
    const romanNumeral = REFERENCE_ROMANS[index];
    return {
      degree,
      romanNumeral,
      role: ROLE_BY_DEGREE[index],
      forms: FORM_QUALITIES_BY_DEGREE[index].map((quality) => ({
        degree,
        romanNumeral,
        root,
        quality,
        symbol: getChordSymbol(root, quality),
        tones: getChordTones(root, quality),
      })),
    };
  });
}
