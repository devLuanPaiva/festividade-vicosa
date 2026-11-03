import type { ReactElement } from 'react';
import type { MatchResultType } from '@/features/games/types';

interface ResultTypeSelectorProps {
  value: MatchResultType;
  onChange: (value: MatchResultType) => void;
}

const OPTIONS: { value: MatchResultType; label: string }[] = [
  { value: 'PLAYED', label: 'Jogado' },
  { value: 'WALKOVER', label: 'W.O.' },
  { value: 'DOUBLE_WALKOVER', label: 'W.O. dos dois' },
];

export function ResultTypeSelector({ value, onChange }: ResultTypeSelectorProps): ReactElement {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-semibold">Como terminou a partida?</legend>
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-admin-line bg-white px-2 text-center text-sm font-semibold has-checked:border-brand-600 has-checked:bg-brand-600 has-checked:text-white has-focus-visible:ring-2 has-focus-visible:ring-brand-500/40"
          >
            <input
              type="radio"
              name="resultType"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
