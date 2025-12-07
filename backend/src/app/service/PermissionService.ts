import { Permission } from "../../entity/role.js";
import { permissionDB } from "../respository/permission.db.js";

export class PermissionService {
  async CreatePermission(permission: Permission) {
    return await permissionDB.CreatePermission(permission);
  }

  async ReadPermissions() {
    return await permissionDB.ReadPermissions();
  }

  async ReadPermission(id: number): Promise<Permission> {
    return await permissionDB.ReadPermission(id);
  }

  async UpdatePermission(permission: Permission) {
    return await permissionDB.UpdatePermission(permission);
  }

  async DeletePermission(id: number) {
    return await permissionDB.DeletePermission(id);
  }
}
