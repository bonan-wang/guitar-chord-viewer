import { LANGUAGE_OPTIONS, Language, Translation } from '../i18n';

type Props = {
  language: Language;
  t: Translation;
  onChange: (language: Language) => void;
};

export function LanguageSelector({ language, t, onChange }: Props) {
  return (
    <label className="field">
      <span>{t.language}</span>
      <select value={language} onChange={(event) => onChange(event.target.value as Language)}>
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
