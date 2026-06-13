import { NoteName } from '../domain/notes';
import { Translation } from '../i18n';

type Props = {
  keys: NoteName[];
  selectedKey: NoteName;
  t: Translation;
  onChange: (key: NoteName) => void;
};

export function KeySelector({ keys, selectedKey, t, onChange }: Props) {
  return (
    <label className="field">
      <span>{t.key}</span>
      <select value={selectedKey} onChange={(event) => onChange(event.target.value as NoteName)}>
        {keys.map((key) => (
          <option key={key} value={key}>
            {key} {t.majorSuffix}
          </option>
        ))}
      </select>
    </label>
  );
}
