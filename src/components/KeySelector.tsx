import { NoteName } from '../domain/notes';

type Props = {
  keys: NoteName[];
  selectedKey: NoteName;
  onChange: (key: NoteName) => void;
};

export function KeySelector({ keys, selectedKey, onChange }: Props) {
  return (
    <label className="field">
      <span>キー</span>
      <select value={selectedKey} onChange={(event) => onChange(event.target.value as NoteName)}>
        {keys.map((key) => (
          <option key={key} value={key}>
            {key} メジャー
          </option>
        ))}
      </select>
    </label>
  );
}
