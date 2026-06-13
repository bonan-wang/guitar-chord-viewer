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
    { sourceId: '0_0_2', pattern: ['x', 3, 5, 5, 5, 3] },
    { sourceId: '0_0_3', pattern: [8, 10, 10, 9, 8, 8] },
    { sourceId: '0_0_4', pattern: [8, 7, 5, 5, 5, 0] },
  ],
  'C:major6': [
    { sourceId: '0_1_1', pattern: ['x', 3, 2, 2, 1, 0] },
    { sourceId: '0_1_2', pattern: ['x', 3, 5, 5, 5, 5] },
    { sourceId: '0_1_3', pattern: [8, 10, 7, 9, 'x', 0] },
    { sourceId: '0_1_4', pattern: ['x', 10, 10, 9, 10, 0] },
  ],
  'C:major7': [
    { sourceId: '0_2_1', pattern: ['x', 3, 2, 0, 0, 0] },
    { sourceId: '0_2_2', pattern: ['x', 3, 5, 4, 5, 3] },
    { sourceId: '0_2_3', pattern: ['x', 0, 4, 3, 2, 1] },
    { sourceId: '0_2_4', pattern: [8, 10, 9, 9, 8, 8] },
    { sourceId: '0_2_5', pattern: [1, 0, 2, 2, 1, 1] },
  ],
  'C:minor': [
    { sourceId: '0_6_1', pattern: ['x', 3, 1, 0, 1, 0] },
    { sourceId: '0_6_2', pattern: ['x', 3, 5, 5, 4, 3] },
    { sourceId: '0_6_3', pattern: [8, 10, 10, 8, 8, 8] },
    { sourceId: '0_6_4', pattern: ['x', 0, 1, 3, 4, 2] },
  ],
  'C:minor7': [
    { sourceId: '0_8_1', pattern: ['x', 3, 1, 3, 1, 3] },
    { sourceId: '0_8_2', pattern: ['x', 3, 5, 3, 4, 3] },
    { sourceId: '0_8_3', pattern: [8, 10, 8, 8, 8, 8] },
    { sourceId: '0_8_4', pattern: ['x', 0, 3, 3, 2, 4] },
  ],
  'C:minor7Flat5': [
    { sourceId: '0_10_1', pattern: ['x', 1, 2, 1, 2, 0] },
    { sourceId: '0_10_2', pattern: [2, 0, 2, 2, 1, 0] },
    { sourceId: '0_10_3', pattern: ['x', 0, 1, 2, 2, 2] },
    { sourceId: '0_10_4', pattern: ['x', 0, 2, 2, 1, 2] },
  ],
  'C:dominant7': [
    { sourceId: '0_14_1', pattern: ['x', 3, 2, 3, 1, 0] },
    { sourceId: '0_14_2', pattern: ['x', 3, 5, 3, 5, 3] },
    { sourceId: '0_14_3', pattern: [8, 10, 8, 9, 8, 8] },
    { sourceId: '0_14_4', pattern: ['x', 0, 1, 3, 2, 3] },
  ],
  'C#:major': [
    { sourceId: '1_0_1', pattern: ['x', 4, 3, 1, 2, 1] },
    { sourceId: '1_0_2', pattern: ['x', 4, 6, 6, 6, 4] },
    { sourceId: '1_0_3', pattern: [9, 11, 11, 10, 9, 9] },
    { sourceId: '1_0_4', pattern: [4, 3, 1, 1, 4, 0] },
  ],
  'C#:major6': [
    { sourceId: '1_1_1', pattern: ['x', 4, 3, 3, 2, 0] },
    { sourceId: '1_1_2', pattern: ['x', 4, 6, 6, 6, 6] },
    { sourceId: '1_1_3', pattern: [2, 0, 1, 3, 2, 0] },
  ],
  'C#:major7': [
    { sourceId: '1_2_1', pattern: ['x', 4, 3, 1, 1, 1] },
    { sourceId: '1_2_2', pattern: ['x', 4, 6, 5, 6, 4] },
    { sourceId: '1_2_3', pattern: ['x', 0, 4, 3, 2, 1] },
    { sourceId: '1_2_4', pattern: [1, 1, 2, 2, 1, 1] },
  ],
  'C#:minor': [
    { sourceId: '1_6_1', pattern: ['x', 4, 6, 6, 5, 4] },
    { sourceId: '1_6_2', pattern: [9, 11, 11, 9, 9, 9] },
    { sourceId: '1_6_3', pattern: ['x', 0, 1, 3, 4, 2] },
    { sourceId: '1_6_4', pattern: ['x', 4, 2, 1, 2, 0] },
  ],
  'C#:minor7': [
    { sourceId: '1_8_1', pattern: ['x', 4, 2, 1, 0, 0] },
    { sourceId: '1_8_2', pattern: ['x', 4, 6, 4, 5, 4] },
    { sourceId: '1_8_3', pattern: [9, 11, 9, 9, 9, 9] },
    { sourceId: '1_8_4', pattern: ['x', 4, 2, 4, 2, 4] },
  ],
  'C#:minor7Flat5': [
    { sourceId: '1_10_1', pattern: ['x', 4, 5, 4, 5, 0] },
    { sourceId: '1_10_2', pattern: [2, 0, 2, 2, 1, 0] },
    { sourceId: '1_10_3', pattern: ['x', 0, 1, 2, 2, 2] },
    { sourceId: '1_10_4', pattern: ['x', 0, 2, 2, 1, 2] },
  ],
  'C#:dominant7': [
    { sourceId: '1_14_1', pattern: ['x', 4, 3, 4, 2, 0] },
    { sourceId: '1_14_2', pattern: ['x', 4, 6, 4, 6, 4] },
    { sourceId: '1_14_3', pattern: [9, 11, 9, 10, 9, 9] },
    { sourceId: '1_14_4', pattern: ['x', 0, 1, 3, 2, 3] },
  ],
  'D:major': [
    { sourceId: '2_0_1', pattern: ['x', 0, 0, 2, 3, 2] },
    { sourceId: '2_0_2', pattern: ['x', 5, 7, 7, 7, 5] },
    { sourceId: '2_0_3', pattern: [10, 12, 12, 11, 10, 10] },
    { sourceId: '2_0_4', pattern: ['x', 5, 4, 2, 3, 2] },
  ],
  'D:major6': [
    { sourceId: '2_1_1', pattern: ['x', 0, 0, 2, 0, 2] },
    { sourceId: '2_1_2', pattern: ['x', 3, 2, 2, 1, 0] },
    { sourceId: '2_1_3', pattern: ['x', 5, 7, 7, 7, 7] },
  ],
  'D:major7': [
    { sourceId: '2_2_1', pattern: ['x', 0, 0, 2, 2, 2] },
    { sourceId: '2_2_2', pattern: ['x', 5, 7, 6, 7, 5] },
    { sourceId: '2_2_3', pattern: ['x', 0, 12, 11, 10, 9] },
    { sourceId: '2_2_4', pattern: [10, 12, 11, 11, 10, 10] },
  ],
  'D:minor': [
    { sourceId: '2_6_1', pattern: ['x', 0, 0, 2, 3, 1] },
    { sourceId: '2_6_2', pattern: ['x', 5, 7, 7, 6, 5] },
    { sourceId: '2_6_3', pattern: [10, 12, 12, 10, 10, 10] },
    { sourceId: '2_6_4', pattern: ['x', 4, 2, 1, 2, 0] },
  ],
  'D:minor7': [
    { sourceId: '2_8_1', pattern: ['x', 0, 0, 2, 1, 1] },
    { sourceId: '2_8_2', pattern: ['x', 5, 7, 5, 6, 5] },
    { sourceId: '2_8_3', pattern: [10, 12, 10, 10, 10, 10] },
    { sourceId: '2_8_4', pattern: ['x', 5, 3, 5, 3, 5] },
  ],
  'D:minor7Flat5': [
    { sourceId: '2_10_1', pattern: ['x', 0, 0, 1, 1, 1] },
    { sourceId: '2_10_2', pattern: ['x', 1, 2, 1, 2, 0] },
    { sourceId: '2_10_3', pattern: [2, 0, 2, 2, 1, 0] },
    { sourceId: '2_10_4', pattern: ['x', 0, 2, 2, 1, 2] },
  ],
  'D:dominant7': [
    { sourceId: '2_14_1', pattern: ['x', 0, 0, 2, 1, 2] },
    { sourceId: '2_14_2', pattern: ['x', 3, 2, 3, 1, 0] },
    { sourceId: '2_14_3', pattern: ['x', 5, 7, 5, 7, 5] },
    { sourceId: '2_14_4', pattern: [10, 12, 10, 11, 10, 10] },
  ],
  'D#:major': [
    { sourceId: '3_0_1', pattern: ['x', 0, 1, 3, 4, 3] },
    { sourceId: '3_0_2', pattern: ['x', 6, 5, 3, 4, 3] },
    { sourceId: '3_0_3', pattern: ['x', 6, 8, 8, 8, 6] },
    { sourceId: '3_0_4', pattern: [4, 3, 1, 1, 1, 0] },
  ],
  'D#:major6': [
    { sourceId: '3_1_1', pattern: ['x', 0, 1, 3, 1, 3] },
    { sourceId: '3_1_2', pattern: ['x', 3, 2, 2, 1, 0] },
    { sourceId: '3_1_3', pattern: ['x', 6, 8, 8, 8, 8] },
  ],
  'D#:major7': [
    { sourceId: '3_2_1', pattern: ['x', 0, 1, 3, 3, 3] },
    { sourceId: '3_2_2', pattern: ['x', 6, 8, 7, 8, 6] },
    { sourceId: '3_2_3', pattern: ['x', 0, 4, 3, 2, 1] },
    { sourceId: '3_2_4', pattern: [11, 13, 12, 12, 11, 11] },
  ],
  'D#:minor': [
    { sourceId: '3_6_1', pattern: ['x', 0, 1, 3, 4, 2] },
    { sourceId: '3_6_2', pattern: ['x', 6, 8, 8, 7, 6] },
    { sourceId: '3_6_3', pattern: [11, 13, 13, 11, 11, 11] },
    { sourceId: '3_6_4', pattern: ['x', 4, 2, 1, 2, 0] },
  ],
  'D#:minor7': [
    { sourceId: '3_8_1', pattern: ['x', 0, 1, 3, 2, 2] },
    { sourceId: '3_8_2', pattern: ['x', 6, 8, 6, 7, 6] },
    { sourceId: '3_8_3', pattern: [11, 13, 11, 11, 11, 11] },
    { sourceId: '3_8_4', pattern: ['x', 6, 4, 6, 4, 6] },
  ],
  'D#:minor7Flat5': [
    { sourceId: '3_10_1', pattern: ['x', 0, 1, 2, 2, 2] },
    { sourceId: '3_10_2', pattern: ['x', 1, 2, 1, 2, 0] },
    { sourceId: '3_10_3', pattern: [2, 0, 2, 2, 1, 0] },
    { sourceId: '3_10_4', pattern: ['x', 0, 11, 11, 10, 11] },
  ],
  'D#:dominant7': [
    { sourceId: '3_14_1', pattern: ['x', 0, 1, 3, 2, 3] },
    { sourceId: '3_14_2', pattern: ['x', 3, 2, 3, 1, 0] },
    { sourceId: '3_14_3', pattern: ['x', 6, 8, 6, 8, 6] },
    { sourceId: '3_14_4', pattern: [11, 13, 11, 12, 11, 11] },
  ],
  'E:major': [
    { sourceId: '4_0_1', pattern: ['x', 2, 2, 1, 0, 0] },
    { sourceId: '4_0_2', pattern: ['x', 7, 6, 4, 5, 4] },
    { sourceId: '4_0_3', pattern: ['x', 7, 9, 9, 9, 7] },
    { sourceId: '4_0_4', pattern: [12, 11, 9, 9, 9, 0] },
  ],
  'E:major6': [
    { sourceId: '4_1_1', pattern: ['x', 2, 2, 1, 2, 0] },
    { sourceId: '4_1_2', pattern: ['x', 0, 1, 3, 3, 3] },
    { sourceId: '4_1_3', pattern: ['x', 3, 2, 2, 1, 0] },
  ],
  'E:major7': [
    { sourceId: '4_2_1', pattern: ['x', 2, 1, 1, 0, 0] },
    { sourceId: '4_2_2', pattern: ['x', 2, 2, 4, 4, 4] },
    { sourceId: '4_2_3', pattern: ['x', 7, 9, 8, 9, 7] },
    { sourceId: '4_2_4', pattern: ['x', 7, 6, 4, 4, 4] },
  ],
  'E:minor': [
    { sourceId: '4_6_1', pattern: ['x', 2, 2, 0, 0, 0] },
    { sourceId: '4_6_2', pattern: ['x', 0, 1, 3, 4, 2] },
    { sourceId: '4_6_3', pattern: ['x', 7, 9, 9, 8, 7] },
    { sourceId: '4_6_4', pattern: ['x', 7, 5, 0, 0, 0] },
  ],
  'E:minor7': [
    { sourceId: '4_8_1', pattern: ['x', 2, 0, 0, 0, 0] },
    { sourceId: '4_8_2', pattern: ['x', 0, 2, 4, 3, 3] },
    { sourceId: '4_8_3', pattern: ['x', 7, 9, 7, 8, 7] },
    { sourceId: '4_8_4', pattern: ['x', 7, 5, 7, 5, 7] },
  ],
  'E:minor7Flat5': [
    { sourceId: '4_10_1', pattern: ['x', 1, 2, 0, 3, 0] },
    { sourceId: '4_10_2', pattern: ['x', 0, 2, 3, 3, 3] },
    { sourceId: '4_10_3', pattern: ['x', 7, 8, 7, 8, 0] },
    { sourceId: '4_10_4', pattern: ['x', 0, 2, 2, 1, 0] },
  ],
  'E:dominant7': [
    { sourceId: '4_14_1', pattern: ['x', 2, 0, 1, 0, 0] },
    { sourceId: '4_14_2', pattern: ['x', 3, 2, 3, 1, 0] },
    { sourceId: '4_14_3', pattern: ['x', 7, 9, 7, 9, 7] },
    { sourceId: '4_14_4', pattern: ['x', 2, 2, 4, 3, 4] },
  ],
  'F:major': [
    { sourceId: '5_0_1', pattern: [1, 3, 3, 2, 1, 1] },
    { sourceId: '5_0_2', pattern: ['x', 8, 7, 5, 6, 5] },
    { sourceId: '5_0_3', pattern: ['x', 8, 10, 10, 10, 8] },
    { sourceId: '5_0_4', pattern: [4, 3, 1, 1, 1, 0] },
  ],
  'F:major6': [
    { sourceId: '5_1_1', pattern: [1, 0, 3, 2, 3, 0] },
    { sourceId: '5_1_2', pattern: ['x', 0, 3, 5, 3, 5] },
    { sourceId: '5_1_3', pattern: ['x', 3, 2, 2, 1, 0] },
  ],
  'F:major7': [
    { sourceId: '5_2_1', pattern: ['x', 0, 3, 2, 1, 0] },
    { sourceId: '5_2_2', pattern: ['x', 0, 3, 5, 5, 5] },
    { sourceId: '5_2_3', pattern: ['x', 8, 10, 9, 10, 8] },
    { sourceId: '5_2_4', pattern: ['x', 8, 7, 5, 5, 5] },
  ],
  'F:minor': [
    { sourceId: '5_6_1', pattern: [1, 3, 3, 1, 1, 1] },
    { sourceId: '5_6_2', pattern: ['x', 0, 1, 3, 4, 2] },
    { sourceId: '5_6_3', pattern: ['x', 8, 10, 10, 9, 8] },
    { sourceId: '5_6_4', pattern: ['x', 4, 2, 1, 2, 0] },
  ],
  'F:minor7': [
    { sourceId: '5_8_1', pattern: [1, 3, 1, 1, 1, 1] },
    { sourceId: '5_8_2', pattern: ['x', 0, 1, 3, 2, 2] },
    { sourceId: '5_8_3', pattern: ['x', 8, 10, 8, 9, 8] },
    { sourceId: '5_8_4', pattern: ['x', 8, 6, 8, 6, 8] },
  ],
  'F:minor7Flat5': [
    { sourceId: '5_10_1', pattern: [1, 0, 1, 1, 0, 0] },
    { sourceId: '5_10_2', pattern: ['x', 0, 1, 2, 2, 2] },
    { sourceId: '5_10_3', pattern: ['x', 1, 2, 1, 2, 0] },
    { sourceId: '5_10_4', pattern: ['x', 4, 3, 1, 1, 1] },
  ],
  'F:dominant7': [
    { sourceId: '5_14_1', pattern: [1, 3, 1, 2, 1, 1] },
    { sourceId: '5_14_2', pattern: ['x', 0, 3, 5, 4, 5] },
    { sourceId: '5_14_3', pattern: ['x', 8, 10, 8, 10, 8] },
    { sourceId: '5_14_4', pattern: ['x', 3, 2, 3, 1, 0] },
  ],
  'F#:major': [
    { sourceId: '6_0_1', pattern: [2, 4, 4, 3, 2, 2] },
    { sourceId: '6_0_2', pattern: ['x', 9, 8, 6, 7, 6] },
    { sourceId: '6_0_3', pattern: ['x', 9, 11, 11, 11, 9] },
    { sourceId: '6_0_4', pattern: [4, 3, 1, 1, 1, 0] },
  ],
  'F#:major6': [
    { sourceId: '6_1_1', pattern: [2, 0, 4, 3, 4, 0] },
    { sourceId: '6_1_2', pattern: ['x', 0, 1, 3, 1, 3] },
    { sourceId: '6_1_3', pattern: ['x', 3, 2, 2, 1, 0] },
  ],
  'F#:major7': [
    { sourceId: '6_2_1', pattern: ['x', 0, 4, 3, 2, 1] },
    { sourceId: '6_2_2', pattern: ['x', 0, 1, 3, 3, 3] },
    { sourceId: '6_2_3', pattern: ['x', 9, 11, 10, 11, 9] },
    { sourceId: '6_2_4', pattern: ['x', 9, 8, 6, 6, 6] },
  ],
  'F#:minor': [
    { sourceId: '6_6_1', pattern: [2, 4, 4, 2, 2, 2] },
    { sourceId: '6_6_2', pattern: ['x', 0, 4, 6, 7, 5] },
    { sourceId: '6_6_3', pattern: ['x', 9, 11, 11, 10, 9] },
    { sourceId: '6_6_4', pattern: ['x', 4, 2, 1, 2, 0] },
  ],
  'F#:minor7': [
    { sourceId: '6_8_1', pattern: [2, 4, 2, 2, 2, 2] },
    { sourceId: '6_8_2', pattern: ['x', 0, 4, 6, 5, 5] },
    { sourceId: '6_8_3', pattern: ['x', 9, 11, 9, 10, 9] },
    { sourceId: '6_8_4', pattern: ['x', 9, 7, 9, 7, 9] },
  ],
  'F#:minor7Flat5': [
    { sourceId: '6_10_1', pattern: [2, 0, 2, 2, 1, 0] },
    { sourceId: '6_10_2', pattern: ['x', 0, 4, 5, 5, 5] },
    { sourceId: '6_10_3', pattern: ['x', 9, 10, 9, 10, 0] },
    { sourceId: '6_10_4', pattern: ['x', 4, 3, 1, 1, 1] },
  ],
  'F#:dominant7': [
    { sourceId: '6_14_1', pattern: [2, 4, 2, 3, 2, 2] },
    { sourceId: '6_14_2', pattern: ['x', 0, 1, 3, 2, 3] },
    { sourceId: '6_14_3', pattern: ['x', 3, 2, 3, 1, 0] },
    { sourceId: '6_14_4', pattern: ['x', 9, 11, 9, 11, 9] },
  ],
  'G:major': [
    { sourceId: '7_0_1', pattern: [3, 2, 0, 0, 0, 3] },
    { sourceId: '7_0_2', pattern: [3, 5, 5, 4, 3, 3] },
    { sourceId: '7_0_3', pattern: ['x', 10, 9, 7, 8, 7] },
    { sourceId: '7_0_4', pattern: ['x', 10, 12, 12, 12, 10] },
  ],
  'G:major6': [
    { sourceId: '7_1_1', pattern: [3, 2, 0, 0, 0, 0] },
    { sourceId: '7_1_2', pattern: ['x', 0, 1, 3, 1, 3] },
    { sourceId: '7_1_3', pattern: ['x', 3, 2, 2, 1, 0] },
  ],
  'G:major7': [
    { sourceId: '7_2_1', pattern: [3, 2, 0, 0, 0, 2] },
    { sourceId: '7_2_2', pattern: ['x', 0, 4, 3, 2, 1] },
    { sourceId: '7_2_3', pattern: ['x', 0, 1, 3, 3, 3] },
    { sourceId: '7_2_4', pattern: ['x', 0, 3, 2, 3, 1] },
  ],
  'G:minor': [
    { sourceId: '7_6_1', pattern: [3, 5, 5, 3, 3, 3] },
    { sourceId: '7_6_2', pattern: ['x', 0, 1, 3, 4, 2] },
    { sourceId: '7_6_3', pattern: ['x', 10, 12, 12, 11, 10] },
    { sourceId: '7_6_4', pattern: ['x', 4, 2, 1, 2, 0] },
  ],
  'G:minor7': [
    { sourceId: '7_8_1', pattern: [3, 5, 3, 3, 3, 3] },
    { sourceId: '7_8_2', pattern: ['x', 0, 1, 3, 2, 2] },
    { sourceId: '7_8_3', pattern: ['x', 10, 8, 10, 8, 10] },
    { sourceId: '7_8_4', pattern: ['x', 10, 12, 10, 11, 10] },
  ],
  'G:minor7Flat5': [
    { sourceId: '7_10_1', pattern: [3, 0, 3, 3, 2, 0] },
    { sourceId: '7_10_2', pattern: ['x', 0, 1, 2, 2, 2] },
    { sourceId: '7_10_3', pattern: ['x', 1, 2, 1, 2, 0] },
    { sourceId: '7_10_4', pattern: ['x', 4, 3, 1, 1, 1] },
  ],
  'G:dominant7': [
    { sourceId: '7_14_1', pattern: [3, 2, 0, 0, 0, 1] },
    { sourceId: '7_14_2', pattern: [3, 5, 3, 4, 3, 3] },
    { sourceId: '7_14_3', pattern: ['x', 0, 1, 3, 2, 3] },
    { sourceId: '7_14_4', pattern: ['x', 3, 2, 3, 1, 0] },
  ],
  'G#:major': [
    { sourceId: '8_0_1', pattern: [4, 3, 1, 1, 1, 4] },
    { sourceId: '8_0_2', pattern: [4, 6, 6, 5, 4, 4] },
    { sourceId: '8_0_3', pattern: ['x', 11, 10, 8, 9, 8] },
    { sourceId: '8_0_4', pattern: ['x', 11, 13, 13, 13, 11] },
  ],
  'G#:major6': [
    { sourceId: '8_1_1', pattern: [4, 3, 1, 1, 1, 1] },
    { sourceId: '8_1_2', pattern: [1, 0, 3, 2, 3, 0] },
    { sourceId: '8_1_3', pattern: ['x', 0, 1, 3, 1, 3] },
  ],
  'G#:major7': [
    { sourceId: '8_2_1', pattern: ['x', 0, 4, 3, 2, 1] },
    { sourceId: '8_2_2', pattern: [1, 0, 2, 2, 1, 0] },
    { sourceId: '8_2_3', pattern: ['x', 0, 1, 3, 3, 3] },
    { sourceId: '8_2_4', pattern: ['x', 11, 10, 8, 8, 8] },
    { sourceId: '8_2_5', pattern: ['x', 11, 13, 12, 13, 11] },
  ],
  'G#:minor': [
    { sourceId: '8_6_1', pattern: [4, 6, 6, 4, 4, 4] },
    { sourceId: '8_6_2', pattern: ['x', 0, 1, 3, 4, 2] },
    { sourceId: '8_6_3', pattern: ['x', 11, 13, 13, 12, 11] },
    { sourceId: '8_6_4', pattern: ['x', 4, 2, 1, 2, 0] },
  ],
  'G#:minor7': [
    { sourceId: '8_8_1', pattern: [4, 6, 4, 4, 4, 4] },
    { sourceId: '8_8_2', pattern: ['x', 0, 1, 3, 2, 2] },
    { sourceId: '8_8_3', pattern: ['x', 11, 13, 11, 12, 11] },
    { sourceId: '8_8_4', pattern: ['x', 11, 9, 11, 9, 11] },
  ],
  'G#:minor7Flat5': [
    { sourceId: '8_10_1', pattern: ['x', 2, 0, 1, 0, 2] },
    { sourceId: '8_10_2', pattern: [2, 0, 2, 2, 1, 0] },
    { sourceId: '8_10_3', pattern: ['x', 0, 1, 2, 2, 2] },
    { sourceId: '8_10_4', pattern: ['x', 4, 3, 1, 1, 1] },
    { sourceId: '8_10_5', pattern: ['x', 1, 2, 1, 2, 0] },
  ],
  'G#:dominant7': [
    { sourceId: '8_14_1', pattern: [4, 6, 4, 5, 4, 4] },
    { sourceId: '8_14_2', pattern: ['x', 0, 1, 3, 2, 3] },
    { sourceId: '8_14_3', pattern: ['x', 3, 2, 3, 1, 0] },
    { sourceId: '8_14_4', pattern: ['x', 11, 13, 11, 13, 11] },
  ],
  'A:major': [
    { sourceId: '9_0_1', pattern: ['x', 0, 2, 2, 2, 0] },
    { sourceId: '9_0_2', pattern: [5, 7, 7, 6, 5, 5] },
    { sourceId: '9_0_3', pattern: ['x', 0, 7, 9, 10, 9] },
    { sourceId: '9_0_4', pattern: ['x', 12, 11, 9, 10, 9] },
  ],
  'A:major6': [
    { sourceId: '9_1_1', pattern: ['x', 0, 2, 2, 2, 2] },
    { sourceId: '9_1_2', pattern: [5, 0, 7, 6, 7, 0] },
    { sourceId: '9_1_3', pattern: ['x', 0, 7, 9, 7, 9] },
  ],
  'A:major7': [
    { sourceId: '9_2_1', pattern: ['x', 0, 2, 1, 2, 0] },
    { sourceId: '9_2_2', pattern: ['x', 0, 7, 6, 5, 4] },
    { sourceId: '9_2_3', pattern: [5, 0, 6, 6, 5, 0] },
    { sourceId: '9_2_4', pattern: ['x', 12, 11, 9, 9, 9] },
  ],
  'A:minor': [
    { sourceId: '9_6_1', pattern: ['x', 0, 2, 2, 1, 0] },
    { sourceId: '9_6_2', pattern: [5, 7, 7, 5, 5, 5] },
    { sourceId: '9_6_3', pattern: ['x', 0, 7, 9, 10, 8] },
    { sourceId: '9_6_4', pattern: ['x', 12, 10, 9, 10, 0] },
  ],
  'A:minor7': [
    { sourceId: '9_8_1', pattern: ['x', 0, 2, 'x', 1, 0] },
    { sourceId: '9_8_2', pattern: [5, 7, 5, 5, 5, 5] },
    { sourceId: '9_8_3', pattern: ['x', 0, 7, 9, 8, 8] },
    { sourceId: '9_8_4', pattern: ['x', 12, 10, 12, 10, 12] },
  ],
  'A:minor7Flat5': [
    { sourceId: '9_10_1', pattern: ['x', 0, 1, 2, 1, 3] },
    { sourceId: '9_10_2', pattern: [2, 0, 2, 2, 1, 0] },
    { sourceId: '9_10_3', pattern: ['x', 0, 7, 8, 8, 8] },
    { sourceId: '9_10_4', pattern: ['x', 0, 1, 0, 1, 0] },
  ],
  'A:dominant7': [
    { sourceId: '9_14_1', pattern: ['x', 0, 2, 0, 2, 0] },
    { sourceId: '9_14_2', pattern: ['x', 0, 2, 2, 2, 3] },
    { sourceId: '9_14_3', pattern: [5, 7, 5, 6, 5, 5] },
    { sourceId: '9_14_4', pattern: ['x', 12, 11, 12, 10, 0] },
  ],
  'A#:major': [
    { sourceId: '10_0_1', pattern: ['x', 1, 3, 3, 3, 1] },
    { sourceId: '10_0_2', pattern: [6, 8, 8, 7, 6, 6] },
    { sourceId: '10_0_3', pattern: ['x', 0, 1, 3, 4, 3] },
    { sourceId: '10_0_4', pattern: ['x', 13, 12, 10, 11, 10] },
  ],
  'A#:major6': [
    { sourceId: '10_1_1', pattern: ['x', 1, 3, 3, 3, 3] },
    { sourceId: '10_1_2', pattern: [1, 0, 3, 2, 3, 0] },
    { sourceId: '10_1_3', pattern: ['x', 0, 1, 3, 1, 3] },
  ],
  'A#:major7': [
    { sourceId: '10_2_1', pattern: ['x', 1, 3, 2, 3, 1] },
    { sourceId: '10_2_2', pattern: [1, 0, 2, 2, 1, 0] },
    { sourceId: '10_2_3', pattern: ['x', 0, 8, 10, 10, 10] },
    { sourceId: '10_2_4', pattern: ['x', 13, 12, 10, 10, 10] },
  ],
  'A#:minor': [
    { sourceId: '10_6_1', pattern: ['x', 1, 3, 3, 2, 1] },
    { sourceId: '10_6_2', pattern: [6, 8, 8, 6, 6, 6] },
    { sourceId: '10_6_3', pattern: ['x', 0, 1, 3, 4, 2] },
    { sourceId: '10_6_4', pattern: ['x', 4, 2, 1, 2, 0] },
  ],
  'A#:minor7': [
    { sourceId: '10_8_1', pattern: ['x', 1, 3, 1, 2, 1] },
    { sourceId: '10_8_2', pattern: [6, 8, 6, 6, 6, 6] },
    { sourceId: '10_8_3', pattern: ['x', 0, 1, 3, 2, 2] },
    { sourceId: '10_8_4', pattern: ['x', 13, 11, 13, 11, 13] },
  ],
  'A#:minor7Flat5': [
    { sourceId: '10_10_1', pattern: ['x', 1, 2, 1, 2, 0] },
    { sourceId: '10_10_2', pattern: [2, 0, 2, 2, 1, 0] },
    { sourceId: '10_10_3', pattern: ['x', 0, 1, 2, 2, 2] },
    { sourceId: '10_10_4', pattern: ['x', 4, 3, 1, 1, 1] },
  ],
  'A#:dominant7': [
    { sourceId: '10_14_1', pattern: ['x', 1, 3, 1, 3, 1] },
    { sourceId: '10_14_2', pattern: [6, 8, 6, 7, 6, 6] },
    { sourceId: '10_14_3', pattern: ['x', 0, 1, 3, 2, 3] },
    { sourceId: '10_14_4', pattern: ['x', 3, 2, 3, 1, 0] },
  ],
  'B:major': [
    { sourceId: '11_0_1', pattern: ['x', 2, 4, 4, 4, 2] },
    { sourceId: '11_0_2', pattern: [7, 9, 9, 8, 7, 7] },
    { sourceId: '11_0_3', pattern: ['x', 0, 1, 3, 4, 3] },
    { sourceId: '11_0_4', pattern: ['x', 14, 13, 11, 12, 11] },
  ],
  'B:major6': [
    { sourceId: '11_1_1', pattern: ['x', 2, 4, 4, 4, 4] },
    { sourceId: '11_1_2', pattern: [1, 0, 3, 2, 3, 0] },
    { sourceId: '11_1_3', pattern: ['x', 0, 1, 3, 1, 3] },
  ],
  'B:major7': [
    { sourceId: '11_2_1', pattern: ['x', 2, 4, 3, 4, 2] },
    { sourceId: '11_2_2', pattern: [1, 0, 2, 2, 1, 0] },
    { sourceId: '11_2_3', pattern: ['x', 0, 1, 3, 3, 3] },
    { sourceId: '11_2_4', pattern: ['x', 14, 13, 11, 11, 11] },
  ],
  'B:minor': [
    { sourceId: '11_6_1', pattern: ['x', 2, 4, 4, 3, 2] },
    { sourceId: '11_6_2', pattern: [7, 9, 9, 7, 7, 7] },
    { sourceId: '11_6_3', pattern: ['x', 0, 1, 3, 4, 2] },
    { sourceId: '11_6_4', pattern: ['x', 4, 2, 1, 2, 0] },
  ],
  'B:minor7': [
    { sourceId: '11_8_1', pattern: ['x', 2, 0, 2, 0, 2] },
    { sourceId: '11_8_2', pattern: ['x', 2, 4, 2, 3, 2] },
    { sourceId: '11_8_3', pattern: [7, 9, 7, 7, 7, 7] },
    { sourceId: '11_8_4', pattern: ['x', 0, 9, 11, 10, 10] },
  ],
  'B:minor7Flat5': [
    { sourceId: '11_10_1', pattern: ['x', 2, 3, 2, 3, 0] },
    { sourceId: '11_10_2', pattern: [2, 0, 2, 2, 1, 0] },
    { sourceId: '11_10_3', pattern: ['x', 0, 9, 10, 10, 10] },
    { sourceId: '11_10_4', pattern: ['x', 4, 3, 1, 1, 1] },
  ],
  'B:dominant7': [
    { sourceId: '11_14_1', pattern: ['x', 2, 1, 2, 0, 2] },
    { sourceId: '11_14_2', pattern: ['x', 2, 4, 2, 4, 2] },
    { sourceId: '11_14_3', pattern: [7, 9, 7, 8, 7, 7] },
    { sourceId: '11_14_4', pattern: ['x', 0, 9, 11, 10, 11] },
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
