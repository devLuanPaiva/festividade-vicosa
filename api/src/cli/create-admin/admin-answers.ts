import { isEmail } from 'class-validator';
import {
  MAX_NAME_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../../common/validation/validation-messages';

export interface AdminAnswers {
  name: string;
  email: string;
  password: string;
}

export type Problem = string | null;

const AFFIRMATIVE_ANSWERS = ['s', 'sim', 'y', 'yes'];

export function validateName(value: string): Problem {
  const name = value.trim();
  if (name === '') {
    return 'Informe o nome.';
  }
  return name.length > MAX_NAME_LENGTH
    ? `O nome deve ter no máximo ${MAX_NAME_LENGTH} caracteres.`
    : null;
}

export function validateEmail(value: string): Problem {
  return isEmail(value.trim()) ? null : 'Informe um e-mail válido.';
}

export function validatePassword(value: string): Problem {
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }
  return value.length > MAX_PASSWORD_LENGTH
    ? `A senha deve ter no máximo ${MAX_PASSWORD_LENGTH} caracteres.`
    : null;
}

export function isAffirmative(answer: string): boolean {
  return AFFIRMATIVE_ANSWERS.includes(answer.trim().toLowerCase());
}
