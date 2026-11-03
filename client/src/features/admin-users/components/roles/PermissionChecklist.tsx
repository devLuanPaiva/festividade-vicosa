import type { ReactElement } from 'react';
import { PERMISSIONS_FIELD } from '../../lib/parse-role-form';
import { groupByResource } from '../../lib/permission-resources';
import type { PermissionDescription } from '../../types';

interface PermissionChecklistProps {
  catalog: PermissionDescription[];
  selected: string[];
  isDisabled: boolean;
  onChange: () => void;
}

export function PermissionChecklist({
  catalog,
  selected,
  isDisabled,
  onChange,
}: PermissionChecklistProps): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      {groupByResource(catalog).map((section) => (
        <fieldset
          key={section.resource}
          className="rounded-2xl border border-admin-line bg-admin-surface"
        >
          <legend className="px-2 text-sm font-bold uppercase tracking-wide text-admin-muted">
            {section.label}
          </legend>
          <ul className="flex flex-col divide-y divide-admin-line">
            {section.permissions.map((permission) => (
              <li key={permission.code}>
                <label className="flex min-h-11 items-center gap-3 p-4">
                  <input
                    type="checkbox"
                    name={PERMISSIONS_FIELD}
                    value={permission.code}
                    defaultChecked={selected.includes(permission.code)}
                    disabled={isDisabled}
                    onChange={onChange}
                    className="size-5"
                  />
                  <span className="flex flex-col">
                    <span className="font-semibold">{permission.description}</span>
                    <span className="text-sm text-admin-muted">{permission.code}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      ))}
    </div>
  );
}
