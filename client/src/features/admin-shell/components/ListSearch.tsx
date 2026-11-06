'use client';

import Form from 'next/form';
import { useEffect, useRef, type ReactElement } from 'react';
import { Icon } from '@/components/ui/Icon';

const SUBMIT_DELAY_MS = 350;
const SHORTCUT_KEY = '/';

export interface SearchFormField {
  name: string;
  value: string;
}

interface ListSearchProps {
  action: string;
  inputId: string;
  placeholder: string;
  defaultValue: string;
  fields: SearchFormField[];
}

function isTyping(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && target.closest('input, textarea, select') !== null;
}

export function ListSearch({
  action,
  inputId,
  placeholder,
  defaultValue,
  fields,
}: Readonly<ListSearchProps>): ReactElement {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const focusOnShortcut = (event: KeyboardEvent): void => {
      if (event.key === SHORTCUT_KEY && !isTyping(event.target)) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', focusOnShortcut);
    return () => window.removeEventListener('keydown', focusOnShortcut);
  }, []);

  const submitSoon = (): void => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => formRef.current?.requestSubmit(), SUBMIT_DELAY_MS);
  };

  return (
    <Form
      ref={formRef}
      action={action}
      role="search"
      className="flex min-h-11 min-w-0 flex-1 items-center rounded-xl border border-admin-line bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30"
    >
      {fields.map((field) => (
        <input key={field.name} type="hidden" name={field.name} value={field.value} />
      ))}
      <label
        htmlFor={inputId}
        className="flex items-center gap-2 pl-3 pr-2 text-sm font-semibold text-admin-muted"
      >
        <Icon name="search" />
        <span className="hidden sm:inline">Buscar</span>
      </label>
      <input
        ref={inputRef}
        id={inputId}
        name="q"
        type="search"
        defaultValue={defaultValue}
        onChange={submitSoon}
        placeholder={placeholder}
        autoComplete="off"
        className="min-h-11 min-w-0 flex-1 bg-transparent pr-3 text-base outline-none"
      />
      <kbd className="mr-3 hidden rounded border border-admin-line px-1.5 text-xs text-admin-muted md:inline">
        /
      </kbd>
    </Form>
  );
}
