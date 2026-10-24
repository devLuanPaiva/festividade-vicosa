import type { ReactElement } from 'react';
import { SelectField, type SelectOption } from '@/components/ui/SelectField';
import type { MatchGroup } from '@/features/admin-teams/types';
import { roundLabel } from '@/features/games/lib/match-labels';
import type { MatchFormControls } from '../hooks/use-match-form';
import { KNOCKOUT_ROUNDS, STAGE_OPTIONS } from '../lib/match-form-options';

const ROUND_OPTIONS: SelectOption[] = [
  { value: '', label: 'Escolha a rodada' },
  ...KNOCKOUT_ROUNDS.map((round) => ({ value: round, label: roundLabel(round) })),
];

interface MatchStageFieldsProps {
  form: MatchFormControls;
  groups: MatchGroup[];
}

export function MatchStageFields({ form, groups }: MatchStageFieldsProps): ReactElement {
  const { state, errorFor, touch, stage, changeStage, changeGroup } = form;
  const groupOptions: SelectOption[] = [
    { value: '', label: 'Escolha o grupo' },
    ...groups.map((group) => ({ value: group.id, label: group.name })),
  ];
  return (
    <>
      <SelectField
        name="stage"
        label="Fase"
        defaultValue={state.values.stage}
        options={STAGE_OPTIONS}
        errorMessage={errorFor('stage')}
        onInput={changeStage}
      />
      {stage === 'GROUP' ? (
        <SelectField
          name="groupId"
          label="Grupo"
          defaultValue={state.values.groupId}
          options={groupOptions}
          errorMessage={errorFor('groupId')}
          onInput={changeGroup}
        />
      ) : (
        <SelectField
          name="round"
          label="Rodada"
          defaultValue={state.values.round}
          options={ROUND_OPTIONS}
          errorMessage={errorFor('round')}
          onInput={touch('round')}
        />
      )}
    </>
  );
}
