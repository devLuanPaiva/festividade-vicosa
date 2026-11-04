import type { ReactElement } from 'react';
import { SelectField } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import { COURT_LOCATION_OPTIONS } from '@/features/games/lib/court-location';
import type { MatchFormControls } from '../hooks/use-match-form';

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
      <SelectField
        name="location"
        label="Local"
        defaultValue={state.values.location}
        options={COURT_LOCATION_OPTIONS}
        errorMessage={errorFor('location')}
        isOptional
        onInput={touch('location')}
      />
    </>
  );
}
