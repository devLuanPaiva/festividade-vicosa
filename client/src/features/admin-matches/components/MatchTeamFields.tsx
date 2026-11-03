import type { ReactElement } from 'react';
import { SelectField } from '@/components/ui/SelectField';
import type { Team } from '@/features/games/types';
import type { MatchFormControls } from '../hooks/use-match-form';
import { teamsOfGroup, toTeamOptions } from '../lib/match-form-options';

interface MatchTeamFieldsProps {
  form: MatchFormControls;
  teams: Team[];
}

function placeholderFor(stage: string, groupId: string): string {
  return stage === 'GROUP' && !groupId ? 'Escolha o grupo primeiro' : 'Escolha o time';
}

export function MatchTeamFields({ form, teams }: MatchTeamFieldsProps): ReactElement {
  const { state, errorFor, touch, stage, groupId } = form;
  const options = toTeamOptions(
    teamsOfGroup(teams, stage, groupId),
    placeholderFor(stage, groupId),
  );
  const fixtureKey = `${stage}-${groupId}`;
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <SelectField
        key={`a-${fixtureKey}`}
        name="teamAId"
        label="Time A"
        defaultValue={state.values.teamAId}
        options={options}
        errorMessage={errorFor('teamAId')}
        onInput={touch('teamAId')}
      />
      <SelectField
        key={`b-${fixtureKey}`}
        name="teamBId"
        label="Time B"
        defaultValue={state.values.teamBId}
        options={options}
        errorMessage={errorFor('teamBId')}
        onInput={touch('teamBId')}
      />
    </div>
  );
}
