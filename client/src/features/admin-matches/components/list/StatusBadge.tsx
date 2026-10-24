import type { ReactElement } from 'react';
import type { RowStatus } from '../../lib/match-list-row';

const TONES: Record<RowStatus, string> = {
  finalized: 'bg-success/10 text-success',
  overdue: 'bg-danger/10 text-danger',
  scheduled: 'bg-admin-canvas text-admin-muted',
};

interface StatusBadgeProps {
  status: RowStatus;
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps): ReactElement {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${TONES[status]}`}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
