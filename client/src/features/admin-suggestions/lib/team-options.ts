import type { SelectOption } from '@/components/ui/SelectField';
import type { Team } from '@/features/games/types';

export function toTeamSelectOptions(teams: Team[]): SelectOption[] {
  return teams.map((team) => ({ value: team.id, label: team.name }));
}
