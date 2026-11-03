import { useActionState, useState } from 'react';
import type { MatchStage } from '@/features/games/types';
import { generalError } from '@/lib/forms/form-errors';
import { useDismissibleErrors } from '@/lib/forms/use-dismissible-errors';
import { useWarnOnDirty } from '@/lib/forms/use-warn-on-dirty';
import { parseStage } from '../lib/parse-match-form';
import { INITIAL_MATCH_STATE, type MatchFormState, type MatchFormValues } from '../types';

const MATCH_FIELDS = ['stage', 'groupId', 'round', 'teamAId', 'teamBId', 'scheduledAt', 'location'];

type MatchAction = (previous: MatchFormState, formData: FormData) => Promise<MatchFormState>;

export interface MatchFormControls {
  state: MatchFormState;
  formAction: (formData: FormData) => void;
  errorFor: (field: string) => string | null;
  touch: (field: string) => () => void;
  otherError: string | null;
  stage: MatchStage;
  groupId: string;
  changeStage: (value: string) => void;
  changeGroup: (value: string) => void;
}

export function useMatchForm(
  action: MatchAction,
  initialValues: MatchFormValues,
): MatchFormControls {
  const [state, formAction] = useActionState(action, {
    ...INITIAL_MATCH_STATE,
    values: initialValues,
  });
  const { errorFor, dismiss } = useDismissibleErrors(state);
  const [isDirty, setIsDirty] = useState(false);
  const [stage, setStage] = useState(initialValues.stage);
  const [groupId, setGroupId] = useState(initialValues.groupId);
  useWarnOnDirty(isDirty);

  const touch = (field: string) => (): void => {
    dismiss(field);
    setIsDirty(true);
  };

  const changeStage = (value: string): void => {
    touch('stage')();
    setStage(parseStage(value));
  };

  const changeGroup = (value: string): void => {
    touch('groupId')();
    setGroupId(value);
  };

  return {
    state,
    formAction,
    errorFor,
    touch,
    otherError: generalError(state, MATCH_FIELDS),
    stage,
    groupId,
    changeStage,
    changeGroup,
  };
}
