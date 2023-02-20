export const isAllowed = (user: any, roles: string[] = []): boolean => {

    // If user is not logged in or there are no roles, return false
    if (!user || roles.length === 0) return false;

    // If user is logged in and there are no roles, return true
    const rolesAccess = roles.map((roleToCheck: string) => user.roles.indexOf(roleToCheck) !== -1);

    // If user is logged in and there are roles, return true if the user has at least one of the roles
    return rolesAccess.every((access: boolean) => access);
};
