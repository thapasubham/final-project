
import AppDataSource from "../../data-source.js";
import { Role } from "../../entity/role.js";
import { permissionDB } from "./permission.db.js";

const roleRepository = AppDataSource.getRepository(Role);
export class RolesDB {
  static async CreateRole(role: Role) {
    const result = await roleRepository.save(role);
    return result;
  }
  static async ReadRoles() {
    const result = await roleRepository.find({
      relations: ["permission"],
      select: {
        id: true,
        name: true,
        permission: {
          id: true,
          name: true,
        },
      },
    });
    return result;
  }

  static async ReadRole(id: number) {
    return await roleRepository.findOne({
      where: { id },
      relations: ["permission"],
      select: {
        id: true,
        name: true,
        permission: {
          id: true,
          name: true,
        },
      },
    });
  }

  static async AddPermissionToRole(roleID: number, permissionID: number) {
    const roles = await roleRepository.findOne({
      where: {
        id: roleID,
      },
      relations: ["permission"],
    });

    const permission = await permissionDB.ReadPermission(permissionID);

    roles.permission.push(permission);
    const result = await roleRepository.save(roles);
    return result;
  }

  static async DeleteRole(id: number) {
    const result = await roleRepository.delete({
      id: id,
    });
    return result.affected;
  }
  static async getrolebyname(default_role: string) {
    const result = await roleRepository.findOne({
      where: { name: default_role },
    });
    return result;
  }
}
