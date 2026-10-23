export const VALIDATION_MESSAGES = {
  email: 'Informe um e-mail válido.',
  passwordRequired: 'Informe a senha.',
  passwordTooShort: 'A senha deve ter pelo menos 6 caracteres.',
  passwordTooLong: 'A senha deve ter no máximo 128 caracteres.',
  nameRequired: 'Informe o nome.',
  nameTooLong: 'O nome deve ter no máximo 120 caracteres.',
  description: 'A descrição deve ser um texto de até 2000 caracteres.',
  location: 'O local deve ser um texto de até 200 caracteres.',
  year: 'Informe um ano válido entre 2000 e 2100.',
  date: 'Informe uma data válida no formato AAAA-MM-DD.',
  subEventType: 'Selecione um tipo de sub-evento válido.',
  roleCode: 'Selecione um papel válido.',
  permissionEffect: 'Informe se a permissão é concedida (GRANTED) ou revogada (REVOKED).',
  permission: 'A permissão informada não existe.',
  id: 'O identificador informado é inválido.',
} as const;

export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 128;
export const MAX_NAME_LENGTH = 120;
export const MAX_DESCRIPTION_LENGTH = 2000;
export const MAX_LOCATION_LENGTH = 200;
export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
