import type { ReactElement } from 'react';

const FIELD_CLASS =
  'min-h-12 w-full rounded-xl border border-admin-line bg-white px-4 text-base text-admin-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30';

interface LoginFieldProps {
  name: string;
  label: string;
  type: 'email' | 'password';
  autoComplete: string;
  defaultValue?: string;
  errorMessage: string | null;
}

export function LoginField({
  name,
  label,
  type,
  autoComplete,
  defaultValue,
  errorMessage,
}: LoginFieldProps): ReactElement {
  const errorId = `${name}-error`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={errorMessage ? errorId : undefined}
        className={FIELD_CLASS}
        required
      />
      {errorMessage ? (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
