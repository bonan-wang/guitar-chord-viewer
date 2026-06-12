import { DiatonicChord } from '../domain/chords';
import { NoteName } from '../domain/notes';

const QUALITY_LABELS = {
  major: 'メジャー',
  minor: 'マイナー',
  diminished: 'ディミニッシュ',
} as const;

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
          <dt>度数</dt>
          <dd>
            {selectedKey} メジャーの {chord.romanNumeral}
          </dd>
        </div>
        <div>
          <dt>種類</dt>
          <dd>{QUALITY_LABELS[chord.quality]}</dd>
        </div>
        <div>
          <dt>構成音</dt>
          <dd>{chord.tones.join('  ')}</dd>
        </div>
      </dl>
    </>
  );
}
