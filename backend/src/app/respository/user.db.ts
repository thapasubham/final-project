import { Auth } from "../auth/authorization";
import { PasswordHasher } from "../auth/hash";
import { constants } from "../../constants/constant";
import AppDataSource from "../../data-source";
import { User } from "../../entity/user";
import { HttpError } from "../middleware/error";
import { login } from "../../types/login.types";
import { DEFAULT_ROLE } from "../../types/permission.types";
import { RolesDB } from "./roles.db";




export class UserDb {

static userRepository = AppDataSource.getRepository(User);
  static async Createuser(user: User) {
    user.role = await RolesDB.getrolebyname(DEFAULT_ROLE);
    if (!user.password) {
      user.password = process.env.DEFAULT_PASSWORD || "password123";
    }
    if (!user.role) {
      user.role = await RolesDB.getrolebyname(DEFAULT_ROLE);
    }

    const entity = UserDb.userRepository.create(user);
    return await  UserDb.userRepository.save(entity);
  }

  static async ReadUser(id: number) {
    const result = await UserDb.userRepository.findOne({
      where: { id: id, isDeleted: false },
      relations: ["role", "role.permission"],
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        phoneNumber: true,
        role: {
          id: true,
          name: true,
          permission: true,
        },
        password: false,
        isDeleted: false,
      },
    });
    if (!result) {
      throw new HttpError(constants.NO_USER, 404);
    }
    return result;
  }

  static async ReadUsers(
    search: string,
    searchby: string,
    limit: number,
    offset: number,
    sort_by: string,
    order: "ASC" | "DESC",
    isVerified: Boolean
  ) {
    let qb = UserDb.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .where(`user.isverified =  ${isVerified}`);

    if (search && searchby) {
      qb = qb.andWhere(`user.${searchby} ILIKE :name`, {
        name: `%${search}%`,
      });
    }

    let result = await qb
      .andWhere("user.isDeleted = :deleted", { deleted: false })
      .select([
        "user.id",
        "user.firstname",
        "user.lastname",
        "user.phoneNumber",
        "user.email",
        "user.isverified",
      ])
      .limit(limit)
      .offset(offset)
      .orderBy(sort_by || "user.id", order || "ASC")
      .getMany();

    return result;
  }

  static async UpdateUser(user: User) {
    let result = await UserDb.userRepository.findOneBy({
      id: user.id,
      isDeleted: false,
    });
    if (!result) {
      throw new HttpError(constants.NO_USER, 404);
    }
    result.firstname = user.firstname;
    result.lastname = user.lastname;
    result.phoneNumber = user.phoneNumber;
    result.email = user.email;
    result.isverified = user.isverified;
    result.password = user.password;
    result.role = user.role;
    const db_result = await UserDb.userRepository.save(result);
    return db_result;
  }

  static async DeleteUser(id: number) {
    const user = await UserDb.userRepository.findOneBy({ id: id, isDeleted: false });

    //if the user with given if found
    if (user) {
      user.isDeleted = true;
      await UserDb.userRepository.save(user);
      //return 1 if it was deleted
      return 1;
    }

    //returns 0 if failed to delete
    return 0;
  }

  static async DeleteUnverified(id: number) {
    const result = await UserDb.userRepository.delete({ id: id });
    return result.affected;
  }

  static async Login(user: login) {
    const result = await UserDb.userRepository.findOne({
      where: { email: user.email, isverified: true },
      relations: {
        role: {
          permission: true,
        },
      },
    });

    if (!result) {
      throw new HttpError(constants.NO_USER, 404);
    }

    await PasswordHasher.Compare(user.password, result.password);

    const id = result.id;
    const signed_token = Auth.Sign(id, result.role.id);
    const permissionNames = result.role.permission.map((p) => p.name);
    return { signed_token, permissions: permissionNames, id: result.id };
  }
}
