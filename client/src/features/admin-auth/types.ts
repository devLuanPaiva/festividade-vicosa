export interface LoginFormState {
  email: string;
  errorMessage: string | null;
  errorField: string | null;
}

export const INITIAL_LOGIN_STATE: LoginFormState = {
  email: '',
  errorMessage: null,
  errorField: null,
};
