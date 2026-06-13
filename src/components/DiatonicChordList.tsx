import { DiatonicChord, DiatonicChordGroup } from '../domain/chords';
import { Translation } from '../i18n';

type Props = {
  groups: DiatonicChordGroup[];
  selectedChordSymbol: string;
  t: Translation;
  onSelectChord: (chord: DiatonicChord) => void;
};

export function DiatonicChordList({ groups, selectedChordSymbol, t, onSelectChord }: Props) {
  return (
    <div className="chord-list">
      {groups.map((group) => (
        <article className="chord-group" key={group.degree}>
          <div className="chord-group-header">
            <span>{group.romanNumeral}</span>
            <small>{t.degreeRole[group.role]}</small>
          </div>
          <div className="chord-form-list">
            {group.forms.map((chord) => (
              <button
                className="chord-button"
                data-selected={chord.symbol === selectedChordSymbol}
                key={chord.symbol}
                type="button"
                aria-pressed={chord.symbol === selectedChordSymbol}
                onClick={() => onSelectChord(chord)}
              >
                <strong>{chord.symbol}</strong>
                <small>{t.qualityLabel[chord.quality]}</small>
              </button>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
