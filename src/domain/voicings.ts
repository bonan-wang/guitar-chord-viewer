import { ChordToneRole, NoteName } from './notes';
import { getChordToneRole, getNoteAtFret, STANDARD_TUNING } from './guitar';

export type StringState =
  | { type: 'muted' }
  | { type: 'played'; fret: number; note: NoteName; chordTone: ChordToneRole };

export type VoicingCandidate = {
  id: string;
  pattern: Array<'x' | number>;
  states: StringState[];
  notes: NoteName[];
  minFret: number;
  maxFret: number;
  fretSpan: number;
  positionLabel: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  score: number;
};

export type PositionRange = {
  id: string;
  labelKey: 'open' | 'low' | 'middle' | 'high' | 'upper';
  min: number;
  max: number;
};

export const POSITION_RANGES: PositionRange[] = [
  { id: 'open', labelKey: 'open', min: 0, max: 0 },
  { id: 'low', labelKey: 'low', min: 1, max: 3 },
  { id: 'middle', labelKey: 'middle', min: 4, max: 6 },
  { id: 'high', labelKey: 'high', min: 7, max: 9 },
  { id: 'upper', labelKey: 'upper', min: 10, max: 12 },
];

type GenerateOptions = {
  startFret?: number;
  endFret?: number;
  maxFretSpan?: number;
  minPlayedStrings?: number;
  limit?: number;
};

type Choice = 'x' | { fret: number; note: NoteName; chordTone: ChordToneRole };

export function formatVoicing(pattern: Array<'x' | number>): string {
  return pattern.join(' ');
}

export function generateVoicings(
  tones: NoteName[],
  options: GenerateOptions = {},
): VoicingCandidate[] {
  const startFret = options.startFret ?? 0;
  const endFret = options.endFret ?? 12;
  const maxFretSpan = options.maxFretSpan ?? 5;
  const minPlayedStrings = options.minPlayedStrings ?? 3;
  const limit = options.limit ?? 36;

  const choicesByString = STANDARD_TUNING.map((openNote) => {
    const choices: Choice[] = ['x'];
    for (let fret = startFret; fret <= endFret; fret += 1) {
      const note = getNoteAtFret(openNote, fret);
      const chordTone = getChordToneRole(note, tones);
      if (chordTone) choices.push({ fret, note, chordTone });
    }
    return choices;
  });

  const candidates: VoicingCandidate[] = [];

  function walk(stringIndex: number, selected: Choice[]): void {
    if (stringIndex === choicesByString.length) {
      const candidate = toCandidate(selected, tones, maxFretSpan, minPlayedStrings);
      if (candidate) candidates.push(candidate);
      return;
    }

    for (const choice of choicesByString[stringIndex]) {
      walk(stringIndex + 1, [...selected, choice]);
    }
  }

  walk(0, []);

  const unique = new Map<string, VoicingCandidate>();
  for (const candidate of candidates.sort((a, b) => a.score - b.score)) {
    unique.set(candidate.id, candidate);
  }

  return [...unique.values()].slice(0, limit);
}

export function selectRepresentativeVoicingsByPosition(
  candidates: VoicingCandidate[],
): VoicingCandidate[] {
  return POSITION_RANGES.flatMap((range) => {
    const match = candidates
      .filter((candidate) =>
        range.id === 'open'
          ? candidate.minFret === 0
          : candidate.minFret >= range.min && candidate.minFret <= range.max,
      )
      .sort((a, b) => a.score - b.score)[0];

    return match ? [match] : [];
  });
}

function toCandidate(
  choices: Choice[],
  tones: NoteName[],
  maxFretSpan: number,
  minPlayedStrings: number,
): VoicingCandidate | undefined {
  const played = choices.filter((choice) => choice !== 'x') as Exclude<Choice, 'x'>[];
  if (played.length < minPlayedStrings) return undefined;

  const included = new Set(played.map((choice) => choice.note));
  if (!tones.every((tone) => included.has(tone))) return undefined;

  const fretted = played.map((choice) => choice.fret).filter((fret) => fret > 0);
  const minFret = fretted.length ? Math.min(...fretted) : 0;
  const maxFret = fretted.length ? Math.max(...fretted) : 0;
  const fretSpan = fretted.length ? maxFret - minFret + 1 : 0;
  if (fretSpan > maxFretSpan) return undefined;

  const pattern = choices.map((choice) => (choice === 'x' ? 'x' : choice.fret));
  const mutedMiddlePenalty = pattern
    .slice(1, 5)
    .filter((value, index, middle) => value === 'x' && middle[index - 1] !== 'x').length;
  const openBonus = pattern.includes(0) ? -3 : 0;
  const bassNote = played[0]?.note;
  const bassPenalty = bassNote === tones[0] ? -2 : 8;
  const score =
    minFret * 10 + fretSpan * 4 + mutedMiddlePenalty * 6 - played.length * 3 + openBonus + bassPenalty;

  return {
    id: formatVoicing(pattern),
    pattern,
    states: choices.map((choice) =>
      choice === 'x'
        ? { type: 'muted' }
        : { type: 'played', fret: choice.fret, note: choice.note, chordTone: choice.chordTone },
    ),
    notes: played.map((choice) => choice.note),
    minFret,
    maxFret,
    fretSpan,
    positionLabel: minFret === 0 ? 'Open position' : `${minFret}th position`,
    difficulty: fretSpan <= 3 && minFret <= 3 ? 'Easy' : fretSpan <= 5 ? 'Medium' : 'Hard',
    score,
  };
}
