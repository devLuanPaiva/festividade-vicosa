import type { ReactElement } from 'react';
import { TextField } from '@/components/ui/TextField';
import type { SuggestionDefaults } from '../types';

const MAX_LOCATION_LENGTH = 200;

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
      <TextField
        name="defaultLocation"
        label="Local padrão"
        defaultValue={defaults.location}
        errorMessage={null}
        maxLength={MAX_LOCATION_LENGTH}
        isOptional
        onInput={touch('defaultLocation')}
      />
    </div>
  );
}
