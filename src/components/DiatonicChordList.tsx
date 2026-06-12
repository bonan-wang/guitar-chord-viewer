import { DiatonicChord } from '../domain/chords';

const QUALITY_LABELS = {
  major: 'メジャー',
  minor: 'マイナー',
  diminished: 'ディミニッシュ',
} as const;

type Props = {
  chords: DiatonicChord[];
  selectedChordSymbol: string;
  onSelectChord: (chord: DiatonicChord) => void;
};

export function DiatonicChordList({ chords, selectedChordSymbol, onSelectChord }: Props) {
  return (
    <div className="chord-list">
      {chords.map((chord) => (
        <button
          className="chord-button"
          data-selected={chord.symbol === selectedChordSymbol}
          key={chord.symbol}
          type="button"
          aria-pressed={chord.symbol === selectedChordSymbol}
          onClick={() => onSelectChord(chord)}
        >
          <span>{chord.romanNumeral}</span>
          <strong>{chord.symbol}</strong>
          <small>{QUALITY_LABELS[chord.quality]}</small>
        </button>
      ))}
    </div>
  );
}
