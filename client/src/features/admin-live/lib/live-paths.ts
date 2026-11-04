import { ADMIN_LIVE_PATH } from '@/features/admin-shell/lib/admin-sections';

export const NEW_LIVE_PATH = `${ADMIN_LIVE_PATH}/nova`;

export function livePath(liveId: string): string {
  return `${ADMIN_LIVE_PATH}/${liveId}`;
}
