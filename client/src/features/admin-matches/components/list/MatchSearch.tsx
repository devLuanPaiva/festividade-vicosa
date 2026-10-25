'use client';

import Form from 'next/form';
import { useEffect, useRef, type ReactElement } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ADMIN_MATCHES_PATH } from '@/features/admin-shell/lib/admin-sections';
import type { FormField } from '../../lib/match-list-query';

const SUBMIT_DELAY_MS = 350;
const SHORTCUT_KEY = '/';

interface MatchSearchProps {
  defaultValue: string;
  fields: FormField[];
}

function isTyping(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && target.closest('input, textarea, select') !== null;
}

export function MatchSearch({ defaultValue, fields }: MatchSearchProps): ReactElement {
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
      action={ADMIN_MATCHES_PATH}
      role="search"
      className="flex min-h-11 min-w-0 flex-1 items-center rounded-xl border border-admin-line bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30"
    >
      {fields.map((field) => (
        <input key={field.name} type="hidden" name={field.name} value={field.value} />
      ))}
      <label
        htmlFor="match-search"
        className="flex items-center gap-2 pl-3 pr-2 text-sm font-semibold text-admin-muted"
      >
        <Icon name="search" />
        <span className="hidden sm:inline">Buscar</span>
      </label>
      <input
        ref={inputRef}
        id="match-search"
        name="q"
        type="search"
        defaultValue={defaultValue}
        onChange={submitSoon}
        placeholder="Time, categoria ou local"
        autoComplete="off"
        className="min-h-11 min-w-0 flex-1 bg-transparent pr-3 text-base outline-none"
      />
      <kbd className="mr-3 hidden rounded border border-admin-line px-1.5 text-xs text-admin-muted md:inline">
        /
      </kbd>
    </Form>
  );
}
