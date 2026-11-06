import type { ReactElement } from 'react';
import { resolveOperationSuccess, type RawSuccessParams } from '../lib/operation-success';
import { AdminNotFound } from './AdminNotFound';
import { OperationSuccessView } from './OperationSuccessView';

interface OperationSuccessLoaderProps {
  searchParams: Promise<RawSuccessParams>;
}

export async function OperationSuccessLoader({
  searchParams,
}: Readonly<OperationSuccessLoaderProps>): Promise<ReactElement> {
  const success = resolveOperationSuccess(await searchParams);
  return success ? <OperationSuccessView success={success} /> : <AdminNotFound />;
}
