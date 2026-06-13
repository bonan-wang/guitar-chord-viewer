import { VoicingCandidate } from '../domain/voicings';

type Props = {
  candidate: VoicingCandidate;
};

const GRID_X = 50;
const TOP_Y = 34;
const STRING_GAP = 18;
const FRET_GAP = 26;
const MIN_VISIBLE_FRETS = 4;
const MARKER_X = 28;

export function ChordDiagram({ candidate }: Props) {
  const baseFret = candidate.minFret <= 1 ? 1 : candidate.minFret;
  const visibleFrets = Math.max(MIN_VISIBLE_FRETS, candidate.maxFret - baseFret + 1);
  const gridWidth = FRET_GAP * visibleFrets;
  const gridHeight = STRING_GAP * 5;
  const bottomY = TOP_Y + gridHeight;
  const viewWidth = GRID_X + gridWidth + 24;
  const viewHeight = bottomY + 34;
  const statesHighToLow = [...candidate.states].reverse();

  return (
    <svg
      className="chord-diagram"
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      role="img"
      aria-label={candidate.id}
    >
      {statesHighToLow.map((state, index) => {
        const y = TOP_Y + STRING_GAP * index;
        const label = state.type === 'muted' ? 'X' : state.fret === 0 ? 'O' : '';
        return (
          <text className="diagram-open-label" x={MARKER_X} y={y + 5} textAnchor="middle" key={index}>
            {label}
          </text>
        );
      })}

      {statesHighToLow.map((_, index) => (
        <line
          className="diagram-string"
          x1={GRID_X}
          x2={GRID_X + gridWidth}
          y1={TOP_Y + STRING_GAP * index}
          y2={TOP_Y + STRING_GAP * index}
          key={index}
        />
      ))}

      {Array.from({ length: visibleFrets + 1 }, (_, index) => {
        const x = GRID_X + FRET_GAP * index;
        return (
          <line
            className={index === 0 && baseFret === 1 ? 'diagram-nut' : 'diagram-fret'}
            x1={x}
            x2={x}
            y1={TOP_Y}
            y2={bottomY}
            key={x}
          />
        );
      })}

      {Array.from({ length: visibleFrets }, (_, index) => {
        const fret = baseFret + index;
        return (
          <text
            className="diagram-fret-label"
            x={GRID_X + FRET_GAP * index + FRET_GAP / 2}
            y={bottomY + 22}
            textAnchor="middle"
            key={fret}
          >
            {fret}
          </text>
        );
      })}

      {statesHighToLow.map((state, index) => {
        if (state.type === 'muted' || state.fret === 0) return null;
        const fretOffset = state.fret - baseFret;
        if (fretOffset < 0 || fretOffset >= visibleFrets) return null;
        const x = GRID_X + FRET_GAP * fretOffset + FRET_GAP / 2;
        const y = TOP_Y + STRING_GAP * index;

        return (
          <g key={`${index}-${state.fret}`}>
            <circle className={`diagram-dot ${state.chordTone}`} cx={x} cy={y} r="7" />
            <text className="diagram-note" x={x} y={y + 4} textAnchor="middle">
              {state.note}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
