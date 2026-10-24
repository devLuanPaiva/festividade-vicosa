import { revalidatePath, updateTag } from 'next/cache';

export function refreshChampionshipData(): void {
  revalidatePath('/admin', 'layout');
  updateTag('standings');
  updateTag('matches');
}
