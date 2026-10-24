import type { ChangeEvent, ReactElement } from 'react';

interface ScoreInputProps {
  name: string;
  label: string;
  value: string;
  errorMessage: string | null;
  onChange: (value: string) => void;
}

export function ScoreInput({
  name,
  label,
  value,
  errorMessage,
  onChange,
}: ScoreInputProps): ReactElement {
  const errorId = `${name}-error`;
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value.replace(/\D/g, ''));
  };
  return (
    <label className="flex min-w-0 flex-1 flex-col items-center gap-2">
      <span className="w-full truncate text-center text-sm font-semibold">{label}</span>
      <input
        name={name}
        value={value}
        onChange={handleChange}
        inputMode="numeric"
        autoComplete="off"
        maxLength={3}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={errorMessage ? errorId : undefined}
        className="min-h-20 w-full rounded-2xl border border-admin-line bg-white text-center text-4xl font-bold outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
      />
      {errorMessage ? (
        <span id={errorId} role="alert" className="text-center text-sm text-danger">
          {errorMessage}
        </span>
      ) : null}
    </label>
  );
}
