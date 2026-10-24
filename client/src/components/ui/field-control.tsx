import type { ReactElement } from 'react';

const FIELD_CLASS =
  'min-h-12 w-full rounded-xl border bg-white px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30';

interface ControlProps {
  id: string;
  name: string;
  className: string;
  'aria-invalid': true | undefined;
  'aria-describedby': string | undefined;
}

export function controlProps(name: string, errorMessage: string | null): ControlProps {
  const hasError = errorMessage !== null;
  return {
    id: name,
    name,
    className: `${FIELD_CLASS} ${hasError ? 'border-danger' : 'border-admin-line'}`,
    'aria-invalid': hasError ? true : undefined,
    'aria-describedby': hasError ? `${name}-error` : undefined,
  };
}

interface FieldErrorProps {
  name: string;
  message: string | null;
}

export function FieldError({ name, message }: FieldErrorProps): ReactElement | null {
  if (message === null) {
    return null;
  }
  return (
    <p id={`${name}-error`} role="alert" className="text-sm text-danger">
      {message}
    </p>
  );
}
