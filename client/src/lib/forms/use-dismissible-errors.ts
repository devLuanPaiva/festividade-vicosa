import { useState } from 'react';
import { errorForField, type FormErrorState } from './form-errors';

interface Dismissal {
  forState: FormErrorState;
  fields: string[];
}

interface DismissibleErrors {
  errorFor: (field: string) => string | null;
  dismiss: (field: string) => void;
}

export function useDismissibleErrors(state: FormErrorState): DismissibleErrors {
  const [dismissal, setDismissal] = useState<Dismissal>({ forState: state, fields: [] });
  const dismissedFields = dismissal.forState === state ? dismissal.fields : [];

  const errorFor = (field: string): string | null =>
    dismissedFields.includes(field) ? null : errorForField(state, field);

  const dismiss = (field: string): void => {
    if (!dismissedFields.includes(field)) {
      setDismissal({ forState: state, fields: [...dismissedFields, field] });
    }
  };

  return { errorFor, dismiss };
}
