import { ChordQuality, ChordToneRole } from './domain/notes';
import { PositionRange } from './domain/voicings';

export type Language = 'ja' | 'en';

export const LANGUAGE_OPTIONS: Array<{ value: Language; label: string }> = [
  { value: 'ja', label: '日本語' },
  { value: 'en', label: 'English' },
];

export const DICTIONARY = {
  ja: {
    appEyebrow: 'ギター・ダイアトニックコード検索',
    appTitle: 'キーのコードと弾きやすいフォーム',
    key: 'キー',
    language: '言語',
    majorSuffix: 'メジャー',
    chordListTitle: (key: string) => `${key} メジャーのダイアトニックコード`,
    fretboardTitle: '指板',
    voicingsTitle: 'コードフォーム候補',
    degree: '度数',
    quality: '種類',
    chordTones: '構成音',
    inMajorKey: (key: string, roman: string) => `${key} メジャーの ${roman}`,
    strings: '弦',
    fret: 'フレット',
    span: '幅',
    qualityLabel: {
      major: 'メジャー',
      minor: 'マイナー',
      diminished: 'ディミニッシュ',
    } satisfies Record<ChordQuality, string>,
    chordToneRole: {
      root: 'ルート',
      third: '3度',
      fifth: '5度',
    } satisfies Record<ChordToneRole, string>,
    difficulty: {
      Easy: 'かんたん',
      Medium: 'ふつう',
      Hard: 'むずかしい',
    },
    position: {
      open: 'オープン',
      low: '1-3フレット',
      middle: '4-6フレット',
      high: '7-9フレット',
      upper: '10-12フレット',
      fallback: (fret: number) => `${fret}フレット付近`,
    },
  },
  en: {
    appEyebrow: 'Guitar Diatonic Chord Finder',
    appTitle: 'Key chords and playable forms',
    key: 'Key',
    language: 'Language',
    majorSuffix: 'major',
    chordListTitle: (key: string) => `${key} major diatonic chords`,
    fretboardTitle: 'Fretboard',
    voicingsTitle: 'Chord form candidates',
    degree: 'Degree',
    quality: 'Quality',
    chordTones: 'Chord tones',
    inMajorKey: (key: string, roman: string) => `${roman} in ${key} major`,
    strings: 'Strings',
    fret: 'Fret',
    span: 'Span',
    qualityLabel: {
      major: 'Major',
      minor: 'Minor',
      diminished: 'Diminished',
    } satisfies Record<ChordQuality, string>,
    chordToneRole: {
      root: 'Root',
      third: '3rd',
      fifth: '5th',
    } satisfies Record<ChordToneRole, string>,
    difficulty: {
      Easy: 'Easy',
      Medium: 'Medium',
      Hard: 'Hard',
    },
    position: {
      open: 'Open',
      low: 'Frets 1-3',
      middle: 'Frets 4-6',
      high: 'Frets 7-9',
      upper: 'Frets 10-12',
      fallback: (fret: number) => `${fret}th position`,
    },
  },
} as const;

export type Translation = (typeof DICTIONARY)[Language];

export function getPositionLabel(candidateMinFret: number, t: Translation): string {
  const range = (
    [
      { labelKey: 'open', min: 0, max: 0 },
      { labelKey: 'low', min: 1, max: 3 },
      { labelKey: 'middle', min: 4, max: 6 },
      { labelKey: 'high', min: 7, max: 9 },
      { labelKey: 'upper', min: 10, max: 12 },
    ] as Pick<PositionRange, 'labelKey' | 'min' | 'max'>[]
  ).find((item) => candidateMinFret >= item.min && candidateMinFret <= item.max);

  return range ? t.position[range.labelKey] : t.position.fallback(candidateMinFret);
}
