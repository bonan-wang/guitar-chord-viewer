import { DiatonicChord } from '../domain/chords';
import { DISPLAY_STRINGS_HIGH_TO_LOW, getFretboard } from '../domain/guitar';
import { Translation } from '../i18n';

type Props = {
  chord: DiatonicChord;
  t: Translation;
  startFret?: number;
  endFret?: number;
};

export function Fretboard({ chord, t, startFret = 0, endFret = 12 }: Props) {
  const frets = Array.from({ length: endFret - startFret + 1 }, (_, index) => startFret + index);
  const positions = getFretboard(chord.tones, startFret, endFret);

  return (
    <div className="fretboard-wrap">
      <div className="fretboard" style={{ gridTemplateColumns: `72px repeat(${frets.length}, 58px)` }}>
        <div className="fret-label">{t.strings}</div>
        {frets.map((fret) => (
          <div className="fret-label" key={fret}>
            {fret}
          </div>
        ))}
        {DISPLAY_STRINGS_HIGH_TO_LOW.map(({ openNote, stringNumber }) => (
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
                      <small>{t.chordToneRole[position.chordTone]}</small>
                    </span>
                  ) : (
                    <span className="empty-note">{position?.note}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
