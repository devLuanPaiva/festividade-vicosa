import type { ReactElement } from 'react';
import { POSITION_FIELD_PREFIX } from '../lib/order-teams-by-position';

interface PositionInputProps {
  teamId: string;
  label: string;
  defaultValue: string;
  onInput: () => void;
}

export function PositionInput({
  teamId,
  label,
  defaultValue,
  onInput,
}: PositionInputProps): ReactElement {
  return (
    <input
      type="number"
      inputMode="numeric"
      min={1}
      name={`${POSITION_FIELD_PREFIX}${teamId}`}
      defaultValue={defaultValue}
      onChange={onInput}
      aria-label={label}
      className="min-h-12 w-20 shrink-0 rounded-xl border border-admin-line bg-white px-2 text-center text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
    />
  );
}
