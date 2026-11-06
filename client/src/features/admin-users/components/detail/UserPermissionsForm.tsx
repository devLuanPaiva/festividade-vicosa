'use client';

import { useActionState, useState, type ReactElement } from 'react';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { saveUserOverridesAction } from '../../actions/user-access-actions';
import { OVERRIDE_FIELD_PREFIX } from '../../lib/override-changes';
import {
  describePermissionRows,
  type OverrideChoice,
  type PermissionRow,
} from '../../lib/permission-origin';
import { groupByResource } from '../../lib/permission-resources';
import {
  INITIAL_ACCESS_STATE,
  type AdminRole,
  type PermissionDescription,
  type PermissionOverride,
} from '../../types';
import { FormFeedback } from '../FormFeedback';
import { PermissionChoiceRow } from './PermissionChoiceRow';

interface UserPermissionsFormProps {
  userId: string;
  catalog: PermissionDescription[];
  roles: AdminRole[];
  overrides: PermissionOverride[];
  canEdit: boolean;
}

function toChoices(rows: PermissionRow[]): Record<string, OverrideChoice> {
  return Object.fromEntries(rows.map((row) => [row.code, row.choice]));
}

export function UserPermissionsForm({
  userId,
  catalog,
  roles,
  overrides,
  canEdit,
}: Readonly<UserPermissionsFormProps>): ReactElement {
  const rows = describePermissionRows({ catalog, roles, overrides });
  const [choices, setChoices] = useState(() => toChoices(rows));
  const [state, formAction] = useActionState(
    saveUserOverridesAction.bind(null, {
      userId,
      permissionCodes: catalog.map(({ code }) => code),
      current: overrides,
    }),
    INITIAL_ACCESS_STATE,
  );
  const rowsByCode = new Map(rows.map((row) => [row.code, row]));

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {groupByResource(catalog).map((section) => (
        <fieldset
          key={section.resource}
          className="rounded-2xl border border-admin-line bg-admin-surface"
        >
          <legend className="px-2 text-sm font-bold uppercase tracking-wide text-admin-muted">
            {section.label}
          </legend>
          <ul className="flex flex-col divide-y divide-admin-line">
            {section.permissions.map(({ code }) => {
              const row = rowsByCode.get(code);
              return row ? (
                <PermissionChoiceRow
                  key={code}
                  row={row}
                  fieldName={`${OVERRIDE_FIELD_PREFIX}${code}`}
                  choice={choices[code] ?? 'INHERIT'}
                  canEdit={canEdit}
                  onChoose={(choice) => setChoices({ ...choices, [code]: choice })}
                />
              ) : null;
            })}
          </ul>
        </fieldset>
      ))}
      <FormFeedback errorMessage={state.errorMessage} isSaved={state.isSaved} />
      {canEdit ? (
        <div>
          <SubmitButton pendingLabel="Salvando…">Salvar permissões</SubmitButton>
        </div>
      ) : null}
    </form>
  );
}
