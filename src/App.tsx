import { useMemo, useState } from 'react';
import { ChordDetail } from './components/ChordDetail';
import { ChordVoicingList } from './components/ChordVoicingList';
import { DiatonicChordList } from './components/DiatonicChordList';
import { Fretboard } from './components/Fretboard';
import { KeySelector } from './components/KeySelector';
import { LanguageSelector } from './components/LanguageSelector';
import { getMajorKeyDiatonicChordGroups } from './domain/chords';
import { CHROMATIC_NOTES, ChordQuality, getNoteDisplayLabel, NoteName } from './domain/notes';
import { generateVoicings, selectRepresentativeVoicingsByPosition } from './domain/voicings';
import { DICTIONARY, Language } from './i18n';

export function App() {
  const [selectedKey, setSelectedKey] = useState<NoteName>('C');
  const [selectedDegree, setSelectedDegree] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState<ChordQuality>('major');
  const [language, setLanguage] = useState<Language>('ja');
  const t = DICTIONARY[language];

  const chordGroups = useMemo(() => getMajorKeyDiatonicChordGroups(selectedKey), [selectedKey]);
  const selectedGroup = chordGroups[selectedDegree - 1] ?? chordGroups[0];
  const selectedChord = selectedGroup.forms.find((form) => form.quality === selectedQuality) ?? selectedGroup.forms[0];
  const voicings = useMemo(
    () => selectRepresentativeVoicingsByPosition(generateVoicings(selectedChord.tones, { limit: 500 })),
    [selectedChord],
  );

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">{t.appEyebrow}</p>
        <h1>{t.appTitle}</h1>
      </header>

      <section className="control-row" aria-label="Key controls">
        <KeySelector
          keys={[...CHROMATIC_NOTES]}
          selectedKey={selectedKey}
          t={t}
          onChange={setSelectedKey}
        />
        <LanguageSelector language={language} t={t} onChange={setLanguage} />
      </section>

      <div className="content-grid">
        <section className="panel">
          <h2>{t.chordListTitle(getNoteDisplayLabel(selectedKey))}</h2>
          <DiatonicChordList
            groups={chordGroups}
            selectedChordSymbol={selectedChord.symbol}
            t={t}
            onSelectChord={(chord) => {
              setSelectedDegree(chord.degree);
              setSelectedQuality(chord.quality);
            }}
          />
        </section>

        <section className="panel">
          <ChordDetail chord={selectedChord} selectedKey={selectedKey} t={t} />
        </section>

        <section className="panel wide">
          <h2>{t.fretboardTitle}</h2>
          <Fretboard chord={selectedChord} t={t} />
        </section>

        <section className="panel wide">
          <h2>{t.voicingsTitle}</h2>
          <ChordVoicingList candidates={voicings} t={t} />
        </section>
      </div>
    </main>
  );
}
