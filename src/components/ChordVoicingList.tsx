import { formatVoicing, VoicingCandidate } from '../domain/voicings';

const DIFFICULTY_LABELS = {
  Easy: 'かんたん',
  Medium: 'ふつう',
  Hard: 'むずかしい',
} as const;

function formatPositionLabel(candidate: VoicingCandidate): string {
  return candidate.minFret === 0 ? 'オープンポジション' : `${candidate.minFret}フレット付近`;
}

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
            <span>{formatPositionLabel(candidate)}</span>
            <span>幅 {candidate.fretSpan || 0}</span>
            <span>{DIFFICULTY_LABELS[candidate.difficulty]}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
