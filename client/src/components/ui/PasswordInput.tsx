'use client';

import { useState, type ComponentProps, type ReactElement } from 'react';

type PasswordInputProps = Omit<ComponentProps<'input'>, 'type'>;

export function PasswordInput({ className = '', ...inputProps }: PasswordInputProps): ReactElement {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="relative">
      <input
        {...inputProps}
        type={isVisible ? 'text' : 'password'}
        className={`${className} pr-24`}
      />
      <button
        type="button"
        onClick={() => setIsVisible(!isVisible)}
        aria-pressed={isVisible}
        aria-label={isVisible ? 'Ocultar senha' : 'Mostrar senha'}
        className="absolute right-1 top-1/2 min-h-11 -translate-y-1/2 rounded-lg px-3 text-sm font-semibold text-brand-700 hover:bg-admin-canvas"
      >
        {isVisible ? 'Ocultar' : 'Mostrar'}
      </button>
    </div>
  );
}
