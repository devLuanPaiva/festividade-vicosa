import type { ReactElement } from 'react';
import { TextField } from '@/components/ui/TextField';
import type { UserFormControls } from '../../hooks/use-user-form';

const MAX_NAME_LENGTH = 120;
const MAX_PASSWORD_LENGTH = 128;

interface UserFieldsProps {
  form: UserFormControls;
  isPasswordOptional: boolean;
}

export function UserFields({ form, isPasswordOptional }: Readonly<UserFieldsProps>): ReactElement {
  const { state, errorFor, touch } = form;
  return (
    <>
      <TextField
        name="name"
        label="Nome"
        defaultValue={state.values.name}
        errorMessage={errorFor('name')}
        maxLength={MAX_NAME_LENGTH}
        autoComplete="name"
        onInput={touch('name')}
      />
      <TextField
        name="email"
        type="email"
        label="E-mail"
        defaultValue={state.values.email}
        errorMessage={errorFor('email')}
        autoComplete="off"
        onInput={touch('email')}
      />
      <TextField
        name="password"
        type="password"
        label={isPasswordOptional ? 'Nova senha' : 'Senha'}
        defaultValue=""
        errorMessage={errorFor('password')}
        maxLength={MAX_PASSWORD_LENGTH}
        isOptional={isPasswordOptional}
        autoComplete="new-password"
        onInput={touch('password')}
      />
    </>
  );
}
