import { EUserRole } from "../../enums/EUserRole.enum";

export const ROLES_NAME_KEY = 'roles';
export const rolesPermissions = {
  // USERS
  createUser: [EUserRole.SUPER_ADMIN],
  getUsers: [EUserRole.SUPER_ADMIN],
  getUser: [EUserRole.SUPER_ADMIN],
  updateUser: [EUserRole.SUPER_ADMIN],
  deleteUser: [EUserRole.SUPER_ADMIN],

  // Client Side Permissions to be put here
}