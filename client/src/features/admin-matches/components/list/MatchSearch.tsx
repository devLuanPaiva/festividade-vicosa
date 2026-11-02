import type { ReactElement } from 'react';
import { ListSearch } from '@/features/admin-shell/components/ListSearch';
import { ADMIN_MATCHES_PATH } from '@/features/admin-shell/lib/admin-sections';
import type { FormField } from '../../lib/match-list-query';

interface MatchSearchProps {
  defaultValue: string;
  fields: FormField[];
}

export function MatchSearch({ defaultValue, fields }: MatchSearchProps): ReactElement {
  return (
    <ListSearch
      action={ADMIN_MATCHES_PATH}
      inputId="match-search"
      placeholder="Time, categoria ou local"
      defaultValue={defaultValue}
      fields={fields}
    />
  );
}
