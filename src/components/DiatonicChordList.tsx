import { DiatonicChord } from '../domain/chords';
import { Translation } from '../i18n';

type Props = {
  chords: DiatonicChord[];
  selectedChordSymbol: string;
  t: Translation;
  onSelectChord: (chord: DiatonicChord) => void;
};

export function DiatonicChordList({ chords, selectedChordSymbol, t, onSelectChord }: Props) {
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
          <small>{t.qualityLabel[chord.quality]}</small>
        </button>
      ))}
    </div>
  );
}
