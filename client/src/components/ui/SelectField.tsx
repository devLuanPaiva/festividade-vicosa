import type { ReactElement } from 'react';
import { FieldError, controlProps } from './field-control';
import { FieldLabel } from './FieldLabel';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  label: string;
  defaultValue: string;
  options: SelectOption[];
  errorMessage: string | null;
  isOptional?: boolean;
  onInput: () => void;
}

export function SelectField({
  name,
  label,
  defaultValue,
  options,
  errorMessage,
  isOptional = false,
  onInput,
}: SelectFieldProps): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="flex flex-col gap-2">
        <FieldLabel text={label} isOptional={isOptional} />
      </label>
      <select
        {...controlProps(name, errorMessage)}
        defaultValue={defaultValue}
        onChange={onInput}
        required={!isOptional}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError name={name} message={errorMessage} />
    </div>
  );
}
