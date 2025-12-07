
import {constants }from "../../constants/constant";
import AppDataSource from "../../data-source.js";
import { Permission } from "../../entity/role.js";
import { HttpError } from "../middleware/error.js";

const permRepository = AppDataSource.getRepository(Permission);

export class permissionDB {
  static async CreatePermission(permission: Permission) {
    const result = await permRepository.save(permission);
    return result;
  }

  static async ReadPermissions() {
    const result = await permRepository.find();
    return result;
  }
  static async ReadPermission(id: number) {
    const result = await permRepository.findOneBy({ id: id });

    return result;
  }

  static async UpdatePermission(permission: Permission) {
    const result = await permRepository.findOne({
      where: { id: permission.id },
    });

    if (!result) {
      throw new HttpError(constants.NO_PERMISSION_FOUND, 404);
    }
    await permRepository.save(permission);
    return 1;
  }

  static async DeletePermission(id: number) {
    const result = await permRepository.findOne({ where: { id: id } });
    if (!result) {
      throw new HttpError(constants.NO_PERMISSION_FOUND, 404);
    }
    result.isDeleted = true;
    await permRepository.save(result);
    return 1;
  }
}
