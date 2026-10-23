import type { ReactElement } from 'react';
import type { Team } from '../types';

const INITIALS_LENGTH = 3;

const SIZE_CLASS_NAMES = {
  small: 'size-10 text-xl',
  large: 'size-16 text-3xl sm:size-24 sm:text-5xl md:size-32 md:text-6xl',
};

interface TeamBadgeProps {
  team: Pick<Team, 'name' | 'abbreviation'>;
  size?: keyof typeof SIZE_CLASS_NAMES;
}

export function TeamBadge({ team, size = 'small' }: TeamBadgeProps): ReactElement {
  const initials = (team.abbreviation ?? team.name).slice(0, INITIALS_LENGTH).toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand-500 font-display tracking-wide text-white ring-2 ring-sun ${SIZE_CLASS_NAMES[size]}`}
    >
      {initials}
    </span>
  );
}
