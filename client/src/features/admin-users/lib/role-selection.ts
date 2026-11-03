export interface RoleSelection {
  roleIds: string[];
  primaryRoleId: string;
}

export function toggleRole(selection: RoleSelection, roleId: string): RoleSelection {
  if (!selection.roleIds.includes(roleId)) {
    return {
      roleIds: [...selection.roleIds, roleId],
      primaryRoleId: selection.primaryRoleId || roleId,
    };
  }
  const roleIds = selection.roleIds.filter((id) => id !== roleId);
  const primaryRoleId =
    selection.primaryRoleId === roleId ? (roleIds[0] ?? '') : selection.primaryRoleId;
  return { roleIds, primaryRoleId };
}

export function choosePrimaryRole(selection: RoleSelection, roleId: string): RoleSelection {
  const roleIds = selection.roleIds.includes(roleId)
    ? selection.roleIds
    : [...selection.roleIds, roleId];
  return { roleIds, primaryRoleId: roleId };
}

export function parseRoleSelection(formData: FormData): RoleSelection {
  const primary = formData.get('primaryRoleId');
  return {
    roleIds: formData.getAll('roleIds').filter((id): id is string => typeof id === 'string'),
    primaryRoleId: typeof primary === 'string' ? primary : '',
  };
}
