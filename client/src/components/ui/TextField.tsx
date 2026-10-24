import type { ReactElement } from 'react';
import { FieldError, controlProps } from './field-control';
import { FieldLabel } from './FieldLabel';

interface TextFieldProps {
  name: string;
  label: string;
  defaultValue: string;
  errorMessage: string | null;
  isOptional?: boolean;
  maxLength?: number;
  autoComplete?: string;
  onInput: () => void;
}

export function TextField({
  name,
  label,
  defaultValue,
  errorMessage,
  isOptional = false,
  maxLength,
  autoComplete = 'off',
  onInput,
}: TextFieldProps): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="flex flex-col gap-2">
        <FieldLabel text={label} isOptional={isOptional} />
      </label>
      <input
        {...controlProps(name, errorMessage)}
        defaultValue={defaultValue}
        onChange={onInput}
        maxLength={maxLength}
        autoComplete={autoComplete}
        required={!isOptional}
      />
      <FieldError name={name} message={errorMessage} />
    </div>
  );
}
