import type { ReactElement } from 'react';
import type { Team } from '@/features/games/types';

interface TeamChoiceProps {
  legend: string;
  name: string;
  teams: Team[];
  value: string;
  errorMessage?: string | null;
  onChange: (teamId: string) => void;
}

export function TeamChoice({
  legend,
  name,
  teams,
  value,
  errorMessage,
  onChange,
}: TeamChoiceProps): ReactElement {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-semibold">{legend}</legend>
      <div className="flex flex-col gap-2">
        {teams.map((team) => (
          <label
            key={team.id}
            className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-admin-line bg-white px-4 text-sm font-semibold has-checked:border-brand-600 has-checked:bg-brand-600/10 has-focus-visible:ring-2 has-focus-visible:ring-brand-500/40"
          >
            <input
              type="radio"
              name={name}
              value={team.id}
              checked={value === team.id}
              onChange={() => onChange(team.id)}
              className="size-5 accent-brand-600"
            />
            {team.name}
          </label>
        ))}
      </div>
      {errorMessage ? (
        <p role="alert" className="text-sm text-danger">
          {errorMessage}
        </p>
      ) : null}
    </fieldset>
  );
}
