import Link from 'next/link';
import type { ReactElement } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ADMIN_HOME_PATH } from '@/lib/auth/auth-paths';
import type { OperationSuccess } from '../lib/operation-success';

const PRIMARY_LINK_CLASS_NAME =
  'inline-flex min-h-12 items-center rounded-xl bg-brand-600 px-6 font-semibold text-white hover:bg-brand-700';
const SECONDARY_LINK_CLASS_NAME =
  'inline-flex min-h-12 items-center rounded-xl border border-admin-line bg-admin-surface px-6 font-semibold hover:border-brand-500';

interface OperationSuccessViewProps {
  success: OperationSuccess;
}

export function OperationSuccessView({ success }: OperationSuccessViewProps): ReactElement {
  return (
    <div role="status">
      <EmptyState tone="admin" icon="check" title={success.title} description={success.description}>
        <Link href={success.backPath} className={SECONDARY_LINK_CLASS_NAME}>
          ← Voltar
        </Link>
        <Link href={ADMIN_HOME_PATH} className={PRIMARY_LINK_CLASS_NAME}>
          Ir para a home
        </Link>
      </EmptyState>
    </div>
  );
}
