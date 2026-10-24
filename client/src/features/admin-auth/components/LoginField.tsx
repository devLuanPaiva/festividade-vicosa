import type { ComponentProps, ReactElement } from 'react';
import { PasswordInput } from './PasswordInput';

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
  const inputProps: ComponentProps<'input'> = {
    id: name,
    name,
    autoComplete,
    defaultValue,
    'aria-invalid': errorMessage ? true : undefined,
    'aria-describedby': errorMessage ? errorId : undefined,
    className: FIELD_CLASS,
    required: true,
  };
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-semibold">
        {label}
      </label>
      {type === 'password' ? (
        <PasswordInput {...inputProps} />
      ) : (
        <input {...inputProps} type={type} />
      )}
      {errorMessage ? (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
