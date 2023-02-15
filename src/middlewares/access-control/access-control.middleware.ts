export const isAllowed = (user: any, roles: string[] = []): boolean => {

    if (!user || roles.length === 0) return false;

    const rolesAccess = roles.map((roleToCheck: string) => user.roles.indexOf(roleToCheck) !== -1);

    return rolesAccess.every((access: boolean) => access);
};
