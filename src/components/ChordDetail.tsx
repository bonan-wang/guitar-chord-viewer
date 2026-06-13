import { DiatonicChord } from '../domain/chords';
import { getNoteDisplayLabel, NoteName } from '../domain/notes';
import { Translation } from '../i18n';

type Props = {
  chord: DiatonicChord;
  selectedKey: NoteName;
  t: Translation;
};

export function ChordDetail({ chord, selectedKey, t }: Props) {
  return (
    <>
      <h2>{chord.symbol}</h2>
      <dl className="detail-list">
        <div>
          <dt>{t.degree}</dt>
          <dd>{t.inMajorKey(getNoteDisplayLabel(selectedKey), chord.romanNumeral)}</dd>
        </div>
        <div>
          <dt>{t.quality}</dt>
          <dd>{t.qualityLabel[chord.quality]}</dd>
        </div>
        <div>
          <dt>{t.chordTones}</dt>
          <dd>{chord.tones.join('  ')}</dd>
        </div>
      </dl>
    </>
  );
}
