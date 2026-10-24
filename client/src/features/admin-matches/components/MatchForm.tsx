'use client';

import type { ReactElement } from 'react';
import { FormFooter } from '@/components/ui/FormFooter';
import type { MatchGroup } from '@/features/admin-teams/types';
import type { Team } from '@/features/games/types';
import { useMatchForm } from '../hooks/use-match-form';
import type { MatchFormState, MatchFormValues } from '../types';
import { MatchFixedTeams } from './MatchFixedTeams';
import { MatchScheduleFields } from './MatchScheduleFields';
import { MatchStageFields } from './MatchStageFields';
import { MatchTeamFields } from './MatchTeamFields';

interface MatchFormProps {
  action: (previous: MatchFormState, formData: FormData) => Promise<MatchFormState>;
  initialValues: MatchFormValues;
  groups: MatchGroup[];
  teams: Team[];
  isNewMatch: boolean;
  canChangeTeams: boolean;
  cancelHref: string;
  submitLabel: string;
}

function FixedFixtureFields({ values }: { values: MatchFormValues }): ReactElement {
  return (
    <>
      <input type="hidden" name="stage" value={values.stage} />
      <input type="hidden" name="groupId" value={values.groupId} />
      <input type="hidden" name="round" value={values.round} />
    </>
  );
}

export function MatchForm({
  action,
  initialValues,
  groups,
  teams,
  isNewMatch,
  canChangeTeams,
  cancelHref,
  submitLabel,
}: MatchFormProps): ReactElement {
  const form = useMatchForm(action, initialValues);
  return (
    <form action={form.formAction} className="flex flex-col gap-5">
      {isNewMatch ? (
        <MatchStageFields form={form} groups={groups} />
      ) : (
        <FixedFixtureFields values={initialValues} />
      )}
      {canChangeTeams ? (
        <MatchTeamFields form={form} teams={teams} />
      ) : (
        <MatchFixedTeams values={initialValues} teams={teams} />
      )}
      <MatchScheduleFields form={form} />
      {form.otherError ? (
        <p role="alert" className="rounded-xl bg-danger/10 p-4 text-sm font-semibold text-danger">
          {form.otherError}
        </p>
      ) : null}
      <FormFooter cancelHref={cancelHref} submitLabel={submitLabel} />
    </form>
  );
}
