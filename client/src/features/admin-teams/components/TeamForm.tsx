'use client';

import type { ReactElement } from 'react';
import { SelectField, type SelectOption } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import { useTeamForm } from '../hooks/use-team-form';
import type { MatchGroup, TeamFormState, TeamFormValues } from '../types';
import { TeamFormFooter } from './TeamFormFooter';

const NO_GROUP_OPTION: SelectOption = { value: '', label: 'Sem grupo' };

interface TeamFormProps {
  action: (previous: TeamFormState, formData: FormData) => Promise<TeamFormState>;
  initialValues: TeamFormValues;
  groups: MatchGroup[];
  cancelHref: string;
  submitLabel: string;
}

export function TeamForm({
  action,
  initialValues,
  groups,
  cancelHref,
  submitLabel,
}: TeamFormProps): ReactElement {
  const { state, formAction, errorFor, touch, otherError } = useTeamForm(action, initialValues);
  const groupOptions = [
    NO_GROUP_OPTION,
    ...groups.map((group) => ({ value: group.id, label: group.name })),
  ];

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <TextField
        name="name"
        label="Nome do time"
        defaultValue={state.values.name}
        errorMessage={errorFor('name')}
        maxLength={120}
        onInput={touch('name')}
      />
      <TextField
        name="city"
        label="Cidade"
        defaultValue={state.values.city}
        errorMessage={errorFor('city')}
        maxLength={120}
        autoComplete="address-level2"
        onInput={touch('city')}
      />
      <TextField
        name="abbreviation"
        label="Abreviação"
        defaultValue={state.values.abbreviation}
        errorMessage={errorFor('abbreviation')}
        maxLength={10}
        isOptional
        onInput={touch('abbreviation')}
      />
      <SelectField
        name="groupId"
        label="Grupo"
        defaultValue={state.values.groupId}
        options={groupOptions}
        errorMessage={errorFor('groupId')}
        isOptional
        onInput={touch('groupId')}
      />
      {otherError ? (
        <p role="alert" className="rounded-xl bg-danger/10 p-4 text-sm font-semibold text-danger">
          {otherError}
        </p>
      ) : null}
      <TeamFormFooter cancelHref={cancelHref} submitLabel={submitLabel} />
    </form>
  );
}
