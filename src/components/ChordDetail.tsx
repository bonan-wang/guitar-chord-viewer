import { DiatonicChord } from '../domain/chords';
import { NoteName } from '../domain/notes';

type Props = {
  chord: DiatonicChord;
  selectedKey: NoteName;
};

export function ChordDetail({ chord, selectedKey }: Props) {
  return (
    <>
      <h2>{chord.symbol}</h2>
      <dl className="detail-list">
        <div>
          <dt>Degree</dt>
          <dd>
            {chord.romanNumeral} in {selectedKey} major
          </dd>
        </div>
        <div>
          <dt>Quality</dt>
          <dd>{chord.quality}</dd>
        </div>
        <div>
          <dt>Tones</dt>
          <dd>{chord.tones.join('  ')}</dd>
        </div>
      </dl>
    </>
  );
}
