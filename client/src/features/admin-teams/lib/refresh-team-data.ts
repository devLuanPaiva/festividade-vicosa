import { revalidatePath, updateTag } from 'next/cache';

export function refreshTeamData(): void {
  revalidatePath('/admin', 'layout');
  updateTag('standings');
  updateTag('matches');
}
