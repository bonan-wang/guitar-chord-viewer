import { VoicingCandidate } from '../domain/voicings';

type Props = {
  candidate: VoicingCandidate;
};

const STRING_X = [28, 58, 88, 118, 148, 178];
const TOP_Y = 34;
const FRET_GAP = 28;
const VISIBLE_FRETS = 4;

export function ChordDiagram({ candidate }: Props) {
  const baseFret = candidate.minFret <= 1 ? 1 : candidate.minFret;
  const showNut = baseFret === 1;

  return (
    <svg className="chord-diagram" viewBox="0 0 206 174" role="img" aria-label={candidate.id}>
      {candidate.states.map((state, index) => {
        const x = STRING_X[index];
        const label = state.type === 'muted' ? 'X' : state.fret === 0 ? 'O' : '';
        return (
          <text className="diagram-open-label" x={x} y="20" textAnchor="middle" key={index}>
            {label}
          </text>
        );
      })}

      {!showNut ? (
        <text className="diagram-fret-label" x="8" y={TOP_Y + 19}>
          {baseFret}
        </text>
      ) : null}

      {STRING_X.map((x) => (
        <line className="diagram-string" x1={x} x2={x} y1={TOP_Y} y2={TOP_Y + FRET_GAP * VISIBLE_FRETS} key={x} />
      ))}

      {Array.from({ length: VISIBLE_FRETS + 1 }, (_, index) => {
        const y = TOP_Y + FRET_GAP * index;
        return (
          <line
            className={showNut && index === 0 ? 'diagram-nut' : 'diagram-fret'}
            x1={STRING_X[0]}
            x2={STRING_X[5]}
            y1={y}
            y2={y}
            key={y}
          />
        );
      })}

      {candidate.states.map((state, index) => {
        if (state.type === 'muted' || state.fret === 0) return null;
        const fretOffset = state.fret - baseFret;
        if (fretOffset < 0 || fretOffset >= VISIBLE_FRETS) return null;
        const x = STRING_X[index];
        const y = TOP_Y + FRET_GAP * fretOffset + FRET_GAP / 2;

        return (
          <g key={`${index}-${state.fret}`}>
            <circle className={`diagram-dot ${state.chordTone}`} cx={x} cy={y} r="10" />
            <text className="diagram-note" x={x} y={y + 4} textAnchor="middle">
              {state.note}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
