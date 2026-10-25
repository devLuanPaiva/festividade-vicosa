export const VALIDATION_MESSAGES = {
  email: 'Informe um e-mail válido.',
  passwordRequired: 'Informe a senha.',
  refreshTokenRequired: 'Informe o token de renovação da sessão.',
  googleIdTokenRequired: 'Informe o token de identidade do Google.',
  googleNonceRequired: 'Informe o nonce usado no login com Google.',
  passwordTooShort: 'A senha deve ter pelo menos 6 caracteres.',
  passwordTooLong: 'A senha deve ter no máximo 128 caracteres.',
  nameRequired: 'Informe o nome.',
  nameTooLong: 'O nome deve ter no máximo 120 caracteres.',
  description: 'A descrição deve ser um texto de até 2000 caracteres.',
  location: 'O local deve ser um texto de até 200 caracteres.',
  year: 'Informe um ano válido entre 2000 e 2100.',
  date: 'Informe uma data válida no formato AAAA-MM-DD.',
  subEventType: 'Selecione um tipo de sub-evento válido.',
  gender: 'Selecione o gênero: masculino (MALE) ou feminino (FEMALE).',
  ageRange: 'A faixa etária deve ser um texto de até 60 caracteres.',
  groupId: 'Informe um grupo válido ou deixe vazio para tirar o time do grupo.',
  roleCode: 'Selecione um papel válido.',
  permissionEffect: 'Informe se a permissão é concedida (GRANTED) ou revogada (REVOKED).',
  permission: 'A permissão informada não existe.',
  id: 'O identificador informado é inválido.',
  cityRequired: 'Informe a cidade.',
  cityTooLong: 'A cidade deve ter no máximo 120 caracteres.',
  abbreviation: 'A abreviação deve ter de 2 a 10 caracteres.',
  slug: 'O slug deve ter apenas letras minúsculas, números e hífens (ex.: bairro-centro).',
  photoKey: 'A chave da foto deve ser um texto de até 255 caracteres.',
  search: 'A busca deve ser um texto de até 120 caracteres.',
  offset: 'O offset deve ser um número inteiro maior ou igual a 0.',
  limit: 'O limit deve ser um número inteiro maior ou igual a 1.',
  active: 'Informe true ou false para filtrar por usuários ativos.',
  stage: 'Selecione a fase da partida: grupos (GROUP) ou mata-mata (KNOCKOUT).',
  round: 'Selecione uma rodada válida do mata-mata.',
  resultType:
    'Informe o tipo de resultado: jogado (PLAYED), W.O. (WALKOVER) ou W.O. dos dois times (DOUBLE_WALKOVER).',
  matchStatus: 'Selecione um status de partida válido.',
  dateTime: 'Informe uma data e hora válidas, como 2026-12-09T19:00:00-03:00.',
  teamId: 'Informe o identificador de um time válido.',
  categoryId: 'Informe o identificador de uma categoria válida.',
  subEventId: 'Informe o identificador de um sub-evento válido.',
  qualifiedTeamIds:
    'Informe os identificadores dos times classificados, do primeiro ao último colocado.',
  bracketTeamIds:
    'Informe de 2 a 16 identificadores de times válidos, do melhor para o pior cabeça de chave.',
  score: 'O placar deve ser um número inteiro entre 0 e 999.',
  penalties: 'Os pênaltis devem ser um número inteiro entre 0 e 999.',
  photoIds: 'Informe os identificadores das fotos do álbum, na nova ordem.',
  bestPlayerName: 'O nome do melhor jogador deve ter no máximo 120 caracteres.',
} as const;

export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 128;
export const MAX_NAME_LENGTH = 120;
export const MAX_TOKEN_LENGTH = 4096;
export const MAX_DESCRIPTION_LENGTH = 2000;
export const MAX_LOCATION_LENGTH = 200;
export const MAX_AGE_RANGE_LENGTH = 60;
export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const MAX_CITY_LENGTH = 120;
export const MIN_ABBREVIATION_LENGTH = 2;
export const MAX_ABBREVIATION_LENGTH = 10;
export const MAX_PHOTO_KEY_LENGTH = 255;
export const MAX_SEARCH_LENGTH = 120;
export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const MAX_SCORE = 999;
