import { DiatonicChord } from './chords';
import { ChordQuality, NoteName } from './notes';
import { generateVoicings, selectRepresentativeVoicingsByPosition, voicingFromPattern, VoicingCandidate } from './voicings';

type ReferencePattern = {
  sourceId: string;
  pattern: Array<'x' | number>;
};

const REFERENCE_PATTERNS: Partial<Record<`${NoteName}:${ChordQuality}`, ReferencePattern[]>> = {
  'C:major': [
    { sourceId: '0_0_1', pattern: ['x', 3, 2, 0, 1, 0] },
    { sourceId: '0_0_2', pattern: ['x', 3, 5, 5, 5, 'x'] },
    { sourceId: '0_0_3', pattern: [8, 10, 10, 9, 8, 8] },
    { sourceId: '0_0_4', pattern: ['x', 10, 10, 9, 8, 8] },
  ],
  'C:major6': [
    { sourceId: '0_1_1', pattern: ['x', 3, 2, 2, 1, 0] },
    { sourceId: '0_1_2', pattern: ['x', 3, 5, 5, 5, 5] },
    { sourceId: '0_1_3', pattern: [8, 10, 10, 9, 10, 8] },
  ],
  'C:major7': [
    { sourceId: '0_2_1', pattern: ['x', 3, 2, 0, 0, 0] },
    { sourceId: '0_2_2', pattern: ['x', 3, 5, 4, 5, 3] },
    { sourceId: '0_2_3', pattern: [8, 10, 9, 9, 8, 8] },
  ],
  'D:minor': [
    { sourceId: '2_6_1', pattern: ['x', 'x', 0, 2, 3, 1] },
    { sourceId: '2_6_2', pattern: ['x', 5, 7, 7, 6, 5] },
    { sourceId: '2_6_3', pattern: [10, 12, 12, 10, 10, 10] },
  ],
  'D:minor7': [
    { sourceId: '2_8_1', pattern: ['x', 'x', 0, 2, 1, 1] },
    { sourceId: '2_8_2', pattern: ['x', 5, 7, 5, 6, 5] },
    { sourceId: '2_8_3', pattern: [10, 12, 10, 10, 10, 10] },
  ],
  'E:minor': [
    { sourceId: '4_6_1', pattern: [0, 2, 2, 0, 0, 0] },
    { sourceId: '4_6_2', pattern: ['x', 7, 9, 9, 8, 7] },
    { sourceId: '4_6_3', pattern: [12, 14, 14, 12, 12, 12] },
  ],
  'E:minor7': [
    { sourceId: '4_8_1', pattern: [0, 2, 0, 0, 0, 0] },
    { sourceId: '4_8_2', pattern: [0, 2, 2, 0, 3, 0] },
    { sourceId: '4_8_3', pattern: ['x', 7, 9, 7, 8, 7] },
  ],
  'F:major': [
    { sourceId: '5_0_1', pattern: [1, 3, 3, 2, 1, 1] },
    { sourceId: '5_0_2', pattern: ['x', 8, 10, 10, 10, 8] },
  ],
  'F:major6': [
    { sourceId: '5_1_1', pattern: [1, 'x', 0, 2, 3, 1] },
    { sourceId: '5_1_2', pattern: ['x', 8, 10, 10, 10, 10] },
  ],
  'F:major7': [
    { sourceId: '5_2_1', pattern: ['x', 3, 3, 2, 1, 0] },
    { sourceId: '5_2_2', pattern: [1, 3, 3, 2, 1, 0] },
    { sourceId: '5_2_3', pattern: ['x', 8, 10, 9, 10, 8] },
  ],
  'G:major': [
    { sourceId: '7_0_1', pattern: [3, 2, 0, 0, 0, 3] },
    { sourceId: '7_0_2', pattern: [3, 5, 5, 4, 3, 3] },
  ],
  'G:dominant7': [
    { sourceId: '7_14_1', pattern: [3, 2, 0, 0, 0, 1] },
    { sourceId: '7_14_2', pattern: [3, 5, 3, 4, 3, 3] },
  ],
  'A:minor': [
    { sourceId: '9_6_1', pattern: ['x', 0, 2, 2, 1, 0] },
    { sourceId: '9_6_2', pattern: [5, 7, 7, 5, 5, 5] },
  ],
  'A:minor7': [
    { sourceId: '9_8_1', pattern: ['x', 0, 2, 0, 1, 0] },
    { sourceId: '9_8_2', pattern: [5, 7, 5, 5, 5, 5] },
  ],
  'B:minor7Flat5': [
    { sourceId: '11_10_1', pattern: ['x', 2, 3, 2, 3, 'x'] },
    { sourceId: '11_10_2', pattern: [7, 'x', 7, 7, 6, 'x'] },
  ],
};

export function getReferenceVoicings(chord: DiatonicChord): VoicingCandidate[] {
  const key = `${chord.root}:${chord.quality}` as const;
  const patterns = REFERENCE_PATTERNS[key] ?? [];
  return patterns
    .map((item) => voicingFromPattern(item.pattern, chord.tones, item.sourceId))
    .filter((candidate): candidate is VoicingCandidate => Boolean(candidate));
}

export function getPreferredVoicings(chord: DiatonicChord): VoicingCandidate[] {
  const referenceVoicings = getReferenceVoicings(chord);
  if (referenceVoicings.length > 0) return referenceVoicings;
  return selectRepresentativeVoicingsByPosition(generateVoicings(chord.tones, { limit: 500 }));
}
