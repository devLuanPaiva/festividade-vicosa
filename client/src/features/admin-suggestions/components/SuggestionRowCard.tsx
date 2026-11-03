import type { ReactElement } from 'react';
import type { SelectOption } from '@/components/ui/SelectField';
import type { SuggestionFormControls } from '../hooks/use-suggestion-form';
import { rowFieldName } from '../lib/parse-suggestion-form';
import type { SuggestionRow } from '../types';
import { SuggestionScheduleFields, SuggestionTeamFields } from './SuggestionRowFields';

const HIDDEN_FIELDS = [
  'stage',
  'groupId',
  'round',
  'bracketPosition',
  'matchId',
  'title',
  'note',
] as const;

interface SuggestionRowCardProps {
  index: number;
  row: SuggestionRow;
  teamOptions: SelectOption[];
  form: SuggestionFormControls;
}

export function SuggestionRowCard({
  index,
  row,
  teamOptions,
  form,
}: SuggestionRowCardProps): ReactElement {
  const include = rowFieldName(index, 'include');
  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-admin-line bg-admin-surface p-4">
      {HIDDEN_FIELDS.map((field) => (
        <input key={field} type="hidden" name={rowFieldName(index, field)} value={row[field]} />
      ))}
      <label className="flex min-h-12 items-center gap-3 font-semibold">
        <input
          type="checkbox"
          name={include}
          defaultChecked={row.isIncluded}
          onChange={form.touch(include)}
          className="size-5"
        />
        {row.title}
      </label>
      {row.note ? <p className="text-sm text-admin-muted">{row.note}</p> : null}
      <SuggestionTeamFields index={index} row={row} teamOptions={teamOptions} form={form} />
      <SuggestionScheduleFields index={index} row={row} form={form} />
    </li>
  );
}
