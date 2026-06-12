import { formatVoicing, VoicingCandidate } from '../domain/voicings';

type Props = {
  candidates: VoicingCandidate[];
};

export function ChordVoicingList({ candidates }: Props) {
  return (
    <div className="voicing-list">
      {candidates.map((candidate) => (
        <article className="voicing-card" key={candidate.id}>
          <div>
            <strong className="voicing-pattern">{formatVoicing(candidate.pattern)}</strong>
            <p>{candidate.notes.join('  ')}</p>
          </div>
          <div className="voicing-meta">
            <span>{candidate.positionLabel}</span>
            <span>Span {candidate.fretSpan || 0}</span>
            <span>{candidate.difficulty}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
