import { revalidatePath } from 'next/cache';

export function refreshChampionshipData(): void {
  revalidatePath('/admin', 'layout');
}
