import type { ReactElement } from 'react';
import { SelectField } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import { COURT_LOCATION_OPTIONS } from '@/features/games/lib/court-location';
import type { SuggestionDefaults } from '../types';

interface SuggestionDefaultFieldsProps {
  defaults: SuggestionDefaults;
  touch: (field: string) => () => void;
}

export function SuggestionDefaultFields({
  defaults,
  touch,
}: SuggestionDefaultFieldsProps): ReactElement {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <TextField
        name="defaultDate"
        type="date"
        label="Data padrão"
        defaultValue={defaults.date}
        errorMessage={null}
        isOptional
        onInput={touch('defaultDate')}
      />
      <TextField
        name="defaultTime"
        type="time"
        label="Hora padrão"
        defaultValue={defaults.time}
        errorMessage={null}
        isOptional
        onInput={touch('defaultTime')}
      />
      <SelectField
        name="defaultLocation"
        label="Local padrão"
        defaultValue={defaults.location}
        options={COURT_LOCATION_OPTIONS}
        errorMessage={null}
        isOptional
        onInput={touch('defaultLocation')}
      />
    </div>
  );
}
