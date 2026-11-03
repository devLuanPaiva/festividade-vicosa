'use client';

import { useActionState, type ReactElement } from 'react';
import { loginAction } from '../actions/login-action';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { errorForField, generalError } from '@/lib/forms/form-errors';
import { INITIAL_LOGIN_STATE } from '../types';
import { LoginField } from './LoginField';

const LOGIN_FIELDS = ['email', 'password'];

export function LoginForm(): ReactElement {
  const [state, formAction] = useActionState(loginAction, INITIAL_LOGIN_STATE);
  const unassignedError = generalError(state, LOGIN_FIELDS);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <LoginField
        name="email"
        label="E-mail"
        type="email"
        autoComplete="username"
        defaultValue={state.email}
        errorMessage={errorForField(state, 'email')}
      />
      <LoginField
        name="password"
        label="Senha"
        type="password"
        autoComplete="current-password"
        errorMessage={errorForField(state, 'password')}
      />
      {unassignedError ? (
        <p role="alert" className="text-sm text-danger">
          {unassignedError}
        </p>
      ) : null}
      <SubmitButton pendingLabel="Entrando…">Entrar</SubmitButton>
    </form>
  );
}
