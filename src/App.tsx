import { useMemo, useState } from 'react';
import { ChordDetail } from './components/ChordDetail';
import { ChordVoicingList } from './components/ChordVoicingList';
import { DiatonicChordList } from './components/DiatonicChordList';
import { Fretboard } from './components/Fretboard';
import { KeySelector } from './components/KeySelector';
import { getMajorKeyDiatonicTriads } from './domain/chords';
import { CHROMATIC_NOTES, NoteName } from './domain/notes';
import { generateVoicings } from './domain/voicings';

export function App() {
  const [selectedKey, setSelectedKey] = useState<NoteName>('C');
  const [selectedDegree, setSelectedDegree] = useState(1);
  const chords = useMemo(() => getMajorKeyDiatonicTriads(selectedKey), [selectedKey]);
  const selectedChord = chords[selectedDegree - 1] ?? chords[0];
  const voicings = useMemo(
    () => generateVoicings(selectedChord.tones, { limit: 30 }),
    [selectedChord],
  );

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">Guitar Diatonic Chord Finder</p>
        <h1>Key chords and playable guitar shapes</h1>
      </header>

      <section className="control-row" aria-label="Key controls">
        <KeySelector
          keys={[...CHROMATIC_NOTES]}
          selectedKey={selectedKey}
          onChange={setSelectedKey}
        />
      </section>

      <div className="content-grid">
        <section className="panel">
          <h2>Diatonic chords in {selectedKey} major</h2>
          <DiatonicChordList
            chords={chords}
            selectedChordSymbol={selectedChord.symbol}
            onSelectChord={(chord) => setSelectedDegree(chord.degree)}
          />
        </section>

        <section className="panel">
          <ChordDetail chord={selectedChord} selectedKey={selectedKey} />
        </section>

        <section className="panel wide">
          <h2>Fretboard</h2>
          <Fretboard chord={selectedChord} />
        </section>

        <section className="panel wide">
          <h2>Voicing candidates</h2>
          <ChordVoicingList candidates={voicings} />
        </section>
      </div>
    </main>
  );
}
