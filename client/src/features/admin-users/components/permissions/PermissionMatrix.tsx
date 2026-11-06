import Link from 'next/link';
import type { ReactElement } from 'react';
import { groupByResource } from '../../lib/permission-resources';
import { rolePath } from '../../lib/user-paths';
import type { AdminRole, PermissionDescription } from '../../types';

interface PermissionMatrixProps {
  catalog: PermissionDescription[];
  roles: AdminRole[];
}

const HEADER_CLASS = 'px-4 py-3 text-xs font-bold uppercase tracking-wide text-admin-muted';

function PermissionCell({ granted }: Readonly<{ granted: boolean }>): ReactElement {
  return (
    <td className="px-4 py-3 text-center">
      {granted ? (
        <span className="font-bold text-success">
          <span aria-hidden="true">✔</span>
          <span className="sr-only">Sim</span>
        </span>
      ) : (
        <span className="text-admin-muted">
          <span aria-hidden="true">—</span>
          <span className="sr-only">Não</span>
        </span>
      )}
    </td>
  );
}

export function PermissionMatrix({
  catalog,
  roles,
}: Readonly<PermissionMatrixProps>): ReactElement {
  return (
    <div className="overflow-x-auto rounded-2xl border border-admin-line bg-admin-surface">
      <table className="w-full min-w-xl">
        <caption className="sr-only">Permissões de cada grupo</caption>
        <thead>
          <tr>
            <th scope="col" className={`${HEADER_CLASS} text-left`}>
              Permissão
            </th>
            {roles.map((role) => (
              <th key={role.id} scope="col" className={`${HEADER_CLASS} text-center`}>
                <Link href={rolePath(role.id)} className="text-brand-700">
                  {role.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        {groupByResource(catalog).map((section) => (
          <tbody key={section.resource}>
            <tr className="bg-admin-canvas">
              <th
                scope="colgroup"
                colSpan={roles.length + 1}
                className={`${HEADER_CLASS} text-left`}
              >
                {section.label}
              </th>
            </tr>
            {section.permissions.map((permission) => (
              <tr key={permission.code} className="border-t border-admin-line">
                <th scope="row" className="px-4 py-3 text-left font-normal">
                  <span className="block font-semibold">{permission.description}</span>
                  <span className="text-sm text-admin-muted">{permission.code}</span>
                </th>
                {roles.map((role) => (
                  <PermissionCell
                    key={role.id}
                    granted={role.permissions.includes(permission.code)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
