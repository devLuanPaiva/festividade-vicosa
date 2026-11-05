import { redirect } from 'next/navigation';
import { successPath, type SuccessOperation } from './operation-success';

export function redirectToSuccess(operation: SuccessOperation, backPath: string): never {
  redirect(successPath(operation, backPath));
}
