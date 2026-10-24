import type { ReactElement } from 'react';

interface FieldLabelProps {
  text: string;
  isOptional?: boolean;
}

export function FieldLabel({ text, isOptional = false }: FieldLabelProps): ReactElement {
  return (
    <span className="text-sm font-semibold">
      {text}{' '}
      {isOptional ? (
        <span className="font-normal text-admin-muted">(opcional)</span>
      ) : (
        <span aria-hidden="true" className="text-danger">
          *
        </span>
      )}
    </span>
  );
}
