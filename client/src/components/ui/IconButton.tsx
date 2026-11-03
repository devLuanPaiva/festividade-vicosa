import type { ReactElement } from 'react';
import { Icon, type IconName } from './Icon';
import { Tooltip } from './Tooltip';

interface IconButtonProps {
  icon: IconName;
  label: string;
  onClick: () => void;
  className?: string;
  ariaExpanded?: boolean;
  ariaPressed?: boolean;
}

export function IconButton({
  icon,
  label,
  onClick,
  className = '',
  ariaExpanded,
  ariaPressed,
}: IconButtonProps): ReactElement {
  return (
    <Tooltip label={label}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-expanded={ariaExpanded}
        aria-pressed={ariaPressed}
        className={`inline-flex size-11 items-center justify-center rounded-xl transition-colors ${className}`}
      >
        <Icon name={icon} />
      </button>
    </Tooltip>
  );
}
