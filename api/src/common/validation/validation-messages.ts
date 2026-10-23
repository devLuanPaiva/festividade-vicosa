export const VALIDATION_MESSAGES = {
  email: 'Informe um e-mail válido.',
  passwordRequired: 'Informe a senha.',
  passwordTooShort: 'A senha deve ter pelo menos 6 caracteres.',
  passwordTooLong: 'A senha deve ter no máximo 128 caracteres.',
  nameRequired: 'Informe o nome.',
  nameTooLong: 'O nome deve ter no máximo 120 caracteres.',
  roleCode: 'Selecione um papel válido.',
  permissionEffect: 'Informe se a permissão é concedida (GRANTED) ou revogada (REVOKED).',
  permission: 'A permissão informada não existe.',
  id: 'O identificador informado é inválido.',
} as const;

export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 128;
export const MAX_NAME_LENGTH = 120;
