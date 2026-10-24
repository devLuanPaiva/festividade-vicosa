'use client';

import type { ReactElement } from 'react';
import { useFormStatus } from 'react-dom';
import { Icon, type IconName } from './Icon';
import { Tooltip } from './Tooltip';

interface IconSubmitButtonProps {
  icon: IconName;
  label: string;
  className?: string;
}

export function IconSubmitButton({
  icon,
  label,
  className = '',
}: IconSubmitButtonProps): ReactElement {
  const { pending } = useFormStatus();
  return (
    <Tooltip label={label}>
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        aria-label={label}
        className={`inline-flex size-11 items-center justify-center rounded-xl transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      >
        <Icon name={icon} />
      </button>
    </Tooltip>
  );
}
