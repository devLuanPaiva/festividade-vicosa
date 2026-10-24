import type { ReactElement } from 'react';
import { requireSessionToken } from '@/lib/auth/current-user';
import { getAdminStandings } from '../services/get-admin-standings';
import { QualifiedGroupForm } from './QualifiedGroupForm';

interface QualifiedTabProps {
  categoryId: string;
}

export async function QualifiedTab({ categoryId }: QualifiedTabProps): Promise<ReactElement> {
  const groups = await getAdminStandings(categoryId, await requireSessionToken());
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-admin-muted">
        Informe a posição de cada time que classifica (1, 2, 3...) e deixe em branco quem não
        classifica. O número de classificados pode variar de um grupo para outro. Em caso de empate,
        a equipe técnica decide a ordem.
      </p>
      {groups.length === 0 ? (
        <p className="rounded-2xl border border-admin-line bg-admin-surface p-5 text-sm text-admin-muted">
          Crie os grupos e cadastre os times antes de confirmar os classificados.
        </p>
      ) : (
        groups.map((group) => <QualifiedGroupForm key={group.groupId} group={group} />)
      )}
    </div>
  );
}
