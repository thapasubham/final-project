import { Role } from "../../entity/role";
import { RolesDB } from "../respository/roles.db";


export class RoleService {
  async CreateRole(role: Role) {
    return await RolesDB.CreateRole(role);
  }

  async ReadRole(id: number) {
    return await RolesDB.ReadRole(id);
  }
  async ReadRoles() {
    return await RolesDB.ReadRoles();
  }

  async UpdateRole(roleID: number, permission_id: number) {
    return await RolesDB.AddPermissionToRole(roleID, permission_id);
  }

  async DeleteRole(id: number) {
    return await RolesDB.DeleteRole(id);
  }
}
