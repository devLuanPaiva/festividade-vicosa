import { Permission } from '../enums/permission.enum';

export interface PermissionDescription {
  code: Permission;
  description: string;
}

const DESCRIPTIONS: Record<Permission, string> = {
  [Permission.SCHEDULE_MANAGE]: 'Gerenciar sub-eventos e itens da programação',
  [Permission.TEAM_MANAGE]: 'Gerenciar categorias, grupos e times',
  [Permission.MATCH_CREATE]: 'Criar, editar e excluir partidas',
  [Permission.MATCH_RECORD_SCORE]: 'Lançar, corrigir e finalizar placares',
  [Permission.PHOTO_UPLOAD]: 'Enviar fotos',
  [Permission.PHOTO_DELETE]: 'Excluir e reordenar as fotos da galeria',
  [Permission.LIVE_MANAGE]: 'Gerenciar as transmissões ao vivo e a seção da live no site',
  [Permission.HISTORY_MANAGE]: 'Gerenciar a linha do tempo da história',
  [Permission.USER_MANAGE]: 'Criar, editar, desativar e excluir usuários',
  [Permission.USER_MANAGE_PERMISSIONS]: 'Alterar grupos e permissões de usuários',
};

export const PERMISSION_CATALOG: PermissionDescription[] = Object.values(Permission).map(
  (code) => ({ code, description: DESCRIPTIONS[code] }),
);
