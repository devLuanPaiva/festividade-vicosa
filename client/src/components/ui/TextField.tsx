import type { ComponentProps, ReactElement } from 'react';
import { FieldError, controlProps } from './field-control';
import { FieldLabel } from './FieldLabel';
import { PasswordInput } from './PasswordInput';

interface TextFieldProps {
  name: string;
  label: string;
  defaultValue: string;
  errorMessage: string | null;
  isOptional?: boolean;
  maxLength?: number;
  type?: 'text' | 'date' | 'time' | 'email' | 'password';
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
  type = 'text',
  autoComplete = 'off',
  onInput,
}: TextFieldProps): ReactElement {
  const inputProps: ComponentProps<'input'> = {
    ...controlProps(name, errorMessage),
    defaultValue,
    onChange: onInput,
    maxLength,
    autoComplete,
    required: !isOptional,
  };
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="flex flex-col gap-2">
        <FieldLabel text={label} isOptional={isOptional} />
      </label>
      {type === 'password' ? (
        <PasswordInput {...inputProps} />
      ) : (
        <input {...inputProps} type={type} />
      )}
      <FieldError name={name} message={errorMessage} />
    </div>
  );
}
