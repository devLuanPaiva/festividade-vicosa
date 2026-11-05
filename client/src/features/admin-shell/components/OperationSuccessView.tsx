import Link from 'next/link';
import type { ReactElement } from 'react';
import { ADMIN_HOME_PATH } from '@/lib/auth/auth-paths';
import type { OperationSuccess } from '../lib/operation-success';
import { SuccessBadge } from './SuccessBadge';

const LINK_CLASS_NAME =
  'inline-flex min-h-12 items-center justify-center rounded-full px-8 font-semibold transition-colors';
const HOME_LINK_CLASS_NAME = `${LINK_CLASS_NAME} bg-white text-success hover:bg-white/90`;
const BACK_LINK_CLASS_NAME = `${LINK_CLASS_NAME} text-white ring-2 ring-white/70 hover:bg-white/15`;

interface OperationSuccessViewProps {
  success: OperationSuccess;
}

export function OperationSuccessView({ success }: OperationSuccessViewProps): ReactElement {
  return (
    <section
      role="status"
      aria-labelledby="operation-success-title"
      className="relative isolate flex min-h-[70dvh] flex-col items-center justify-center gap-6 overflow-hidden rounded-3xl bg-linear-to-br from-success to-emerald-800 p-8 text-center text-white shadow-[0_20px_50px_rgba(31,138,45,0.35)] md:p-12"
    >
      <span
        aria-hidden="true"
        className="absolute -left-16 -top-16 -z-10 size-64 rounded-full bg-white/10"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-24 -right-10 -z-10 size-80 rounded-full bg-white/10"
      />
      <SuccessBadge />
      <div className="flex max-w-md flex-col gap-2">
        <h1 id="operation-success-title" className="text-3xl font-bold md:text-4xl">
          {success.title}
        </h1>
        <p className="text-base text-white/90 md:text-lg">{success.description}</p>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
        <Link href={success.backPath} className={BACK_LINK_CLASS_NAME}>
          ← Voltar
        </Link>
        <Link href={ADMIN_HOME_PATH} className={HOME_LINK_CLASS_NAME}>
          Ir para a home
        </Link>
      </div>
    </section>
  );
}
