import { DiatonicChord } from '../domain/chords';
import { getFretboard, STANDARD_TUNING } from '../domain/guitar';

type Props = {
  chord: DiatonicChord;
  startFret?: number;
  endFret?: number;
};

export function Fretboard({ chord, startFret = 0, endFret = 12 }: Props) {
  const frets = Array.from({ length: endFret - startFret + 1 }, (_, index) => startFret + index);
  const positions = getFretboard(chord.tones, startFret, endFret);

  return (
    <div className="fretboard-wrap">
      <div className="fretboard" style={{ gridTemplateColumns: `72px repeat(${frets.length}, 58px)` }}>
        <div className="fret-label">String</div>
        {frets.map((fret) => (
          <div className="fret-label" key={fret}>
            {fret}
          </div>
        ))}
        {STANDARD_TUNING.map((openNote, stringIndex) => {
          const stringNumber = 6 - stringIndex;
          return (
            <div className="fret-row" key={`${stringNumber}-${openNote}`}>
              <div className="string-name">
                {stringNumber} {openNote}
              </div>
              {frets.map((fret) => {
                const position = positions.find(
                  (item) => item.stringNumber === stringNumber && item.fret === fret,
                );
                return (
                  <div className="fret-cell" key={fret}>
                    {position?.chordTone ? (
                      <span className={`note-marker ${position.chordTone}`}>
                        {position.note}
                        <small>{position.chordTone}</small>
                      </span>
                    ) : (
                      <span className="empty-note">{position?.note}</span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
