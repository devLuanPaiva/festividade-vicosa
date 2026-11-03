import { revalidatePath } from 'next/cache';

export function refreshUsersData(): void {
  revalidatePath('/admin', 'layout');
}
