const CHAMPIONSHIP_PERMISSIONS = ['match:record-score', 'match:create', 'team:manage'];

export function canViewChampionshipDashboard(permissions: string[]): boolean {
  return CHAMPIONSHIP_PERMISSIONS.some((permission) => permissions.includes(permission));
}
