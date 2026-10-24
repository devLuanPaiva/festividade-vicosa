import type { ReactElement } from 'react';
import { TextField } from '@/components/ui/TextField';
import type { MatchFormControls } from '../hooks/use-match-form';

const MAX_LOCATION_LENGTH = 200;

interface MatchScheduleFieldsProps {
  form: MatchFormControls;
}

export function MatchScheduleFields({ form }: MatchScheduleFieldsProps): ReactElement {
  const { state, errorFor, touch } = form;
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="date"
          type="date"
          label="Data"
          defaultValue={state.values.date}
          errorMessage={errorFor('scheduledAt')}
          onInput={touch('scheduledAt')}
        />
        <TextField
          name="time"
          type="time"
          label="Hora"
          defaultValue={state.values.time}
          errorMessage={null}
          onInput={touch('scheduledAt')}
        />
      </div>
      <TextField
        name="location"
        label="Local"
        defaultValue={state.values.location}
        errorMessage={errorFor('location')}
        maxLength={MAX_LOCATION_LENGTH}
        isOptional
        onInput={touch('location')}
      />
    </>
  );
}
