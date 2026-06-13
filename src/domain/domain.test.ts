import { describe, expect, it } from 'vitest';
import { getMajorKeyDiatonicTriads } from './chords';
import { DISPLAY_STRINGS_HIGH_TO_LOW, getFretboard, STANDARD_TUNING } from './guitar';
import { getMajorScale } from './scales';
import { generateVoicings, selectRepresentativeVoicingsByPosition } from './voicings';

describe('music domain', () => {
  it('generates major scales', () => {
    expect(getMajorScale('C')).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
    expect(getMajorScale('G')).toEqual(['G', 'A', 'B', 'C', 'D', 'E', 'F#']);
  });

  it('generates C major diatonic triads', () => {
    expect(getMajorKeyDiatonicTriads('C').map((chord) => chord.symbol)).toEqual([
      'C',
      'Dm',
      'Em',
      'F',
      'G',
      'Am',
      'Bdim',
    ]);
  });

  it('maps standard tuning and chord-tone fretboard positions', () => {
    expect(STANDARD_TUNING).toEqual(['E', 'A', 'D', 'G', 'B', 'E']);
    expect(DISPLAY_STRINGS_HIGH_TO_LOW.map((item) => item.stringNumber)).toEqual([1, 2, 3, 4, 5, 6]);
    const positions = getFretboard(['C', 'E', 'G'], 0, 12);
    expect(positions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ stringNumber: 6, fret: 0, note: 'E' }),
        expect.objectContaining({ stringNumber: 6, fret: 3, note: 'G' }),
        expect.objectContaining({ stringNumber: 5, fret: 3, note: 'C' }),
        expect.objectContaining({ stringNumber: 2, fret: 1, note: 'C' }),
      ]),
    );
  });

  it('generates practical voicings for C major', () => {
    const voicings = generateVoicings(['C', 'E', 'G'], { limit: 20 });
    expect(voicings.map((voicing) => voicing.id)).toContain('x 3 2 0 1 0');
    expect(voicings[0].notes).toEqual(expect.arrayContaining(['C', 'E', 'G']));
  });

  it('selects representative voicings by position', () => {
    const representatives = selectRepresentativeVoicingsByPosition(
      generateVoicings(['C', 'E', 'G'], { limit: 500 }),
    );

    expect(representatives.map((voicing) => voicing.id)).toContain('x 3 2 0 1 0');
    expect(representatives.length).toBeGreaterThan(1);
    expect(new Set(representatives.map((voicing) => voicing.minFret)).size).toBe(representatives.length);
  });
});
