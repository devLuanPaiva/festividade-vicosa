import type { ReactElement } from 'react';
import {
  isPermissionEffective,
  type OverrideChoice,
  type PermissionRow,
} from '../../lib/permission-origin';

const CHOICE_LABELS: { choice: OverrideChoice; label: string }[] = [
  { choice: 'INHERIT', label: 'Do grupo' },
  { choice: 'GRANTED', label: 'Conceder' },
  { choice: 'REVOKED', label: 'Revogar' },
];

interface PermissionChoiceRowProps {
  row: PermissionRow;
  fieldName: string;
  choice: OverrideChoice;
  canEdit: boolean;
  onChoose: (choice: OverrideChoice) => void;
}

function Outcome({ isAllowed }: { isAllowed: boolean }): ReactElement {
  const tone = isAllowed ? 'bg-success/10 text-success' : 'bg-admin-canvas text-admin-muted';
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>
      {isAllowed ? 'Permitida' : 'Negada'}
    </span>
  );
}

export function PermissionChoiceRow({
  row,
  fieldName,
  choice,
  canEdit,
  onChoose,
}: Readonly<PermissionChoiceRowProps>): ReactElement {
  const origin = row.roleNames.length > 0 ? row.roleNames.join(', ') : 'nenhum grupo';
  return (
    <li className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <span className="font-semibold">{row.description}</span>
        <span className="text-sm text-admin-muted">
          {row.code} · vem de: {origin}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div role="radiogroup" aria-label={row.description} className="flex flex-wrap gap-1">
          {CHOICE_LABELS.map((option) => (
            <label
              key={option.choice}
              className="flex min-h-11 items-center gap-2 rounded-xl border border-admin-line px-3 text-sm"
            >
              <input
                type="radio"
                name={fieldName}
                value={option.choice}
                checked={choice === option.choice}
                disabled={!canEdit}
                onChange={() => onChoose(option.choice)}
              />
              {option.label}
            </label>
          ))}
        </div>
        <Outcome isAllowed={isPermissionEffective(choice, row.roleNames)} />
      </div>
    </li>
  );
}
