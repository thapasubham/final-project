import { Auth } from "../auth/authorization";
import { User } from "../../entity/user";
import { UserDb } from "../respository/user.db";
import { Login } from "../../types/login.types";
import { PaymentDB } from "../respository/payment.db";

/**
 * Class to perfrom CRUD operation
 * @example
 * const userService = new UserService();
 */
export class UserService {
  /**
   *
   * Creates new user
   * @param {User} [user] - Pass the user object you want to create
   *
   * @returns {User} - Newly created user.
   *
   * @example
   * const user= {id: 4, firstname: "John", lastname :"Pork"}
   * const result = userService.CreateUser(user);
   *
   */
  async CreateUser(user: User): Promise<User> {
    const createdUser: User = await UserDb.Createuser(user);

    return createdUser;
  }

  /**
   *
   * Delete user with id
   * @param {number} [id] - Pass the user object you want to create
   *
   * @returns {number} - Status if deleted or not.
   *
   *
   * @example
   * const result = userService.CreateUser(4);
   * //This returns 1 if the user is deleted and 0 if failed to deleted.
   *
   */
  async DeleteUser(id: number): Promise<number> {
    const del = await UserDb.DeleteUser(id);

    return del;
  }

  /**
   * Returns a list of users or a single user if an ID is provided.
   *
   * @param {number} [limit] - Total number of users to retrieve.
   * @param {number} [offset] - Number of users to skip from the start.
   * @param {number} [id] - The ID of the user to return.
   * @returns {User[], totalCount} - The requested users. Always returns array.
   *
   * @example
   * //Get user by Id
   * const user = await userService.ReadUsers(0,0,id);
   * //remember the user is still array
   *
   * //Get users with pagination
   * const users = await userService.ReadUsers(limit, offset);
   */

  async ReadUser(id: number) {
    const user = await UserDb.ReadUser(id);
    return user;
  }
  async ReadUsers(
    search: string,
    searchby: string,
    filter: string,
    limit: number,
    offset: number,
    orderBy: string,
    role: string
  ) {
    const result = await UserDb.ReadUsers(
      search,
      searchby,
      limit as number,
      offset as number,
      filter,
      orderBy as "ASC" | "DESC",
      role
    );
    console.log(result, limit);

    return result;
  }

  async Update(user: User): Promise<User> {
    const result = await UserDb.UpdateUser(user);

    return result;
  }

  async Login(user: Login) {
    const result = await UserDb.Login(user);
    return result;
  }
  async Refresh(id: number) {
    const user = await UserDb.ReadUser(id);
    const signed_token = Auth.Sign(user.id, user.role.id);

    const permissionName = user.role.permission.map((p) => p.name);
    return {
      signed_token,
      permissions: permissionName,
      id: user.id,
      role: user.role.name,
    };
  }

  async DeleteUnverified(id: number) {
    const result = UserDb.DeleteUnverified(id);
    return result;
  }

  async purchasedFonts(
    userId: number,
    page = 1,
    limit = 5,
    sortBy: "name" | "price" | "purchasedAt" = "purchasedAt",
    order: "ASC" | "DESC" = "DESC"
  ) {
    const result = await PaymentDB.purchasedFonts(
      userId,
      Number(page),
      Number(limit),
      sortBy as any,
      order as any
    );
    return result;
  }
}
