import { ADMIN_HOME_PATH } from '@/lib/auth/auth-paths';

export const SUCCESS_PATH = '/admin/sucesso';

const OPERATION_PARAM = 'operacao';
const BACK_PARAM = 'voltar';
const ADMIN_PATH_PREFIX = '/admin/';

export interface OperationMessage {
  title: string;
  description: string;
}

const OPERATION_MESSAGES = {
  'team-created': { title: 'Time criado', description: 'O time foi cadastrado com sucesso.' },
  'team-updated': { title: 'Time atualizado', description: 'As alterações do time foram salvas.' },
  'team-deleted': { title: 'Time excluído', description: 'O time foi removido com sucesso.' },
  'match-created': { title: 'Partida criada', description: 'A partida foi agendada com sucesso.' },
  'match-updated': {
    title: 'Partida atualizada',
    description: 'As alterações da partida foram salvas.',
  },
  'match-deleted': {
    title: 'Partida excluída',
    description: 'A partida foi removida com sucesso.',
  },
  'matches-confirmed': {
    title: 'Partidas confirmadas',
    description: 'As partidas selecionadas foram salvas na programação.',
  },
  'result-recorded': {
    title: 'Resultado registrado',
    description: 'O resultado da partida foi salvo e a classificação foi atualizada.',
  },
  'live-created': {
    title: 'Transmissão criada',
    description: 'A transmissão foi cadastrada com sucesso.',
  },
  'live-updated': {
    title: 'Transmissão atualizada',
    description: 'As alterações da transmissão foram salvas.',
  },
  'live-deleted': {
    title: 'Transmissão excluída',
    description: 'A transmissão foi removida com sucesso.',
  },
  'user-created': { title: 'Usuário criado', description: 'O usuário foi cadastrado com sucesso.' },
  'user-activated': { title: 'Usuário ativado', description: 'O usuário voltou a ter acesso.' },
  'user-deactivated': {
    title: 'Usuário desativado',
    description: 'O usuário não consegue mais entrar no painel.',
  },
  'user-deleted': { title: 'Usuário excluído', description: 'O usuário foi removido com sucesso.' },
  'role-created': { title: 'Grupo criado', description: 'O grupo foi cadastrado com sucesso.' },
  'role-deleted': { title: 'Grupo excluído', description: 'O grupo foi removido com sucesso.' },
} as const satisfies Record<string, OperationMessage>;

export type SuccessOperation = keyof typeof OPERATION_MESSAGES;

export interface OperationSuccess extends OperationMessage {
  backPath: string;
}

export type RawSuccessParams = Record<string, string | string[] | undefined>;

export function successPath(operation: SuccessOperation, backPath: string): string {
  const query = new URLSearchParams({ [OPERATION_PARAM]: operation, [BACK_PARAM]: backPath });
  return `${SUCCESS_PATH}?${query.toString()}`;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isSafeAdminPath(path: string): boolean {
  return path.startsWith(ADMIN_PATH_PREFIX) && !path.startsWith('//') && !path.includes('\\');
}

function isSuccessOperation(value: string | undefined): value is SuccessOperation {
  return value !== undefined && Object.hasOwn(OPERATION_MESSAGES, value);
}

export function resolveOperationSuccess(params: RawSuccessParams): OperationSuccess | null {
  const operation = firstValue(params[OPERATION_PARAM]);
  if (!isSuccessOperation(operation)) {
    return null;
  }
  const requestedBack = firstValue(params[BACK_PARAM]) ?? '';
  const backPath = isSafeAdminPath(requestedBack) ? requestedBack : ADMIN_HOME_PATH;
  return { ...OPERATION_MESSAGES[operation], backPath };
}
