import type { ReactElement } from 'react';
import { requireCurrentUser, requireSessionToken } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { splitAdminMatches } from '../lib/split-admin-matches';
import { getAdminMatches } from '../services/get-admin-matches';
import { AdminMatchSection } from './AdminMatchSection';

export async function AdminMatchesLoader(): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'match:record-score')) {
    return <p>Seu usuário não tem permissão para lançar placares.</p>;
  }
  const token = await requireSessionToken();
  const groups = splitAdminMatches(await getAdminMatches(token), new Date());
  return (
    <div className="flex flex-col gap-8">
      <AdminMatchSection
        title="Jogos de hoje"
        emptyMessage="Nenhum jogo marcado para hoje."
        matches={groups.today}
      />
      <AdminMatchSection title="Sem resultado lançado" matches={groups.overdue} />
      <AdminMatchSection title="Próximos jogos" matches={groups.upcoming} />
      <AdminMatchSection title="Finalizados recentemente" matches={groups.recentlyFinalized} />
    </div>
  );
}
