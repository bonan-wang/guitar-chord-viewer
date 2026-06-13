import { describe, expect, it } from 'vitest';
import { getChordTones, getMajorKeyDiatonicChordGroups, getMajorKeyDiatonicTriads } from './chords';
import { DISPLAY_STRINGS_HIGH_TO_LOW, getFretboard, STANDARD_TUNING } from './guitar';
import { CHROMATIC_NOTES, type ChordQuality } from './notes';
import { getPreferredVoicings, getReferenceVoicings } from './referenceVoicings';
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

  it('generates reference chord forms for C major', () => {
    expect(getMajorKeyDiatonicChordGroups('C').map((group) => group.forms.map((form) => form.symbol))).toEqual([
      ['C', 'C6', 'Cmaj7'],
      ['Dm', 'Dm7'],
      ['Em', 'Em7'],
      ['F', 'F6', 'Fmaj7'],
      ['G', 'G7'],
      ['Am', 'Am7'],
      ['Bm7-5'],
    ]);
  });

  it('generates reference chord forms for other keys', () => {
    expect(getMajorKeyDiatonicChordGroups('G').flatMap((group) => group.forms.map((form) => form.symbol))).toEqual([
      'G',
      'G6',
      'Gmaj7',
      'Am',
      'Am7',
      'Bm',
      'Bm7',
      'C',
      'C6',
      'Cmaj7',
      'D',
      'D7',
      'Em',
      'Em7',
      'F#(G♭)m7-5',
    ]);
  });

  it('generates extended chord tones', () => {
    expect(getChordTones('C', 'major7')).toEqual(['C', 'E', 'G', 'B']);
    expect(getChordTones('G', 'dominant7')).toEqual(['G', 'B', 'D', 'F']);
    expect(getChordTones('B', 'minor7Flat5')).toEqual(['B', 'D', 'F', 'A']);
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

  it('uses built-in reference voicings for C major forms', () => {
    const chord = getMajorKeyDiatonicChordGroups('C')[0].forms[0];
    const voicings = getReferenceVoicings(chord);

    expect(voicings.map((voicing) => voicing.id)).toContain('x 3 2 0 1 0');
    expect(voicings[0].sourceId).toBe('0_0_1');
  });

  it('has built-in reference voicings for every supported root and form quality', () => {
    const qualities: ChordQuality[] = [
      'major',
      'major6',
      'major7',
      'minor',
      'minor7',
      'dominant7',
      'minor7Flat5',
    ];

    for (const root of CHROMATIC_NOTES) {
      for (const quality of qualities) {
        expect(
          getReferenceVoicings({
            degree: 1,
            romanNumeral: 'I',
            root,
            quality,
            symbol: `${root}:${quality}`,
            tones: getChordTones(root, quality),
          }).length,
          `${root}:${quality}`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it('falls back to generated voicings when no local reference form exists', () => {
    const chord = getMajorKeyDiatonicTriads('C')[6];
    const voicings = getPreferredVoicings(chord);

    expect(voicings.length).toBeGreaterThan(0);
    expect(voicings.some((voicing) => voicing.sourceId)).toBe(false);
  });
});
