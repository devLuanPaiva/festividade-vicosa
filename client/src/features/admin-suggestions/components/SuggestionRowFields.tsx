import type { ReactElement } from 'react';
import { SelectField, type SelectOption } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import type { SuggestionFormControls } from '../hooks/use-suggestion-form';
import { rowFieldName } from '../lib/parse-suggestion-form';
import type { SuggestionRow } from '../types';

const MAX_LOCATION_LENGTH = 200;

interface SuggestionRowFieldsProps {
  index: number;
  row: SuggestionRow;
  teamOptions: SelectOption[];
  form: SuggestionFormControls;
}

export function SuggestionTeamFields({
  index,
  row,
  teamOptions,
  form,
}: SuggestionRowFieldsProps): ReactElement {
  const { errorFor, touch } = form;
  const teamA = rowFieldName(index, 'teamAId');
  const teamB = rowFieldName(index, 'teamBId');
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SelectField
        name={teamA}
        label="Time A"
        defaultValue={row.teamAId}
        options={teamOptions}
        errorMessage={errorFor(teamA)}
        onInput={touch(teamA)}
      />
      <SelectField
        name={teamB}
        label="Time B"
        defaultValue={row.teamBId}
        options={teamOptions}
        errorMessage={errorFor(teamB)}
        onInput={touch(teamB)}
      />
    </div>
  );
}

export function SuggestionScheduleFields({
  index,
  row,
  form,
}: Omit<SuggestionRowFieldsProps, 'teamOptions'>): ReactElement {
  const { errorFor, touch } = form;
  const date = rowFieldName(index, 'date');
  const time = rowFieldName(index, 'time');
  const location = rowFieldName(index, 'location');
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <TextField
        name={date}
        type="date"
        label="Data"
        defaultValue={row.date}
        errorMessage={errorFor(date)}
        isOptional
        onInput={touch(date)}
      />
      <TextField
        name={time}
        type="time"
        label="Hora"
        defaultValue={row.time}
        errorMessage={errorFor(time)}
        isOptional
        onInput={touch(time)}
      />
      <div className="col-span-2 sm:col-span-1">
        <TextField
          name={location}
          label="Local"
          defaultValue={row.location}
          errorMessage={errorFor(location)}
          maxLength={MAX_LOCATION_LENGTH}
          isOptional
          onInput={touch(location)}
        />
      </div>
    </div>
  );
}
