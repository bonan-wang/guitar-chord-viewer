import { formatVoicing, VoicingCandidate } from '../domain/voicings';
import { getPositionLabel, Translation } from '../i18n';
import { ChordDiagram } from './ChordDiagram';

type Props = {
  candidates: VoicingCandidate[];
  t: Translation;
};

export function ChordVoicingList({ candidates, t }: Props) {
  return (
    <div className="voicing-list">
      {candidates.map((candidate) => (
        <article className="voicing-card" key={candidate.id}>
          <ChordDiagram candidate={candidate} />
          <div>
            <strong className="voicing-pattern">{formatVoicing(candidate.pattern)}</strong>
            <p>{candidate.notes.join('  ')}</p>
          </div>
          <div className="voicing-meta">
            <span>{getPositionLabel(candidate.minFret, t)}</span>
            <span>
              {t.span} {candidate.fretSpan || 0}
            </span>
            <span>{t.difficulty[candidate.difficulty]}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
