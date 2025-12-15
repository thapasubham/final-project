import { Request, Response } from "express";

import { sanitizeInput } from "../middleware/sanitizeUser.js";
import { UserService } from "../service/UserService.js";
import { ResponseApi, responseType } from "../../utils/ApiResponse.js";
import { User } from "../../entity/user.js";
import { constants } from "../../constants/constant.js";
import { parseBody } from "../../utils/utils.js";

const userService = new UserService();
export class UserController {
  async CreateUser(req: Request, res: Response) {
    const response: responseType<User> = {
      message: "",
      status: 200,
    };

    const bodyData: User = parseBody(req);
    const user = sanitizeInput(bodyData);

    await userService.CreateUser(user);

    response.status = 201;
    response.message = "User Created";

    ResponseApi.WriteResponse(res, response);
  }

  async GetUsers(req: Request, res: Response) {
    const response: responseType<any> = {
      status: 200,
    };

    const {
      search = "",
      searchby = "",
      sort_by = "user.id",
      order = "ASC",
      role = "",
    } = req.query;

    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    const result = await userService.ReadUsers(
      search as string,
      searchby as string,
      sort_by as string,
      limit,
      offset,
      (order as string).toUpperCase() as "ASC" | "DESC",
      role as string
    );
    if (!result || result.userList.length === 0) {
      response.message = constants.NO_MORE_USER;
      response.status = 404;
    } else {
      response.data = {
        users: result.userList,
        totalCount: result.totalCount,
        limit,
        offset,
      };
      response.status = 200;
    }

    ResponseApi.WriteResponse(res, response);
  }

  async GetUser(req: Request, res: Response) {
    const response: responseType<User> = {
      status: 200,
    };

    const id = parseInt(req.params.id);
    const user = await userService.ReadUser(id);

    response.status = 200;
    response.data = user as User;

    ResponseApi.WriteResponse(res, response);
  }

  async UpdateUser(req: Request, res: Response) {
    const response: responseType<User> = {
      message: "",
      status: 200,
    };

    const id = parseInt(req.params.id);
    const userData: User = parseBody(req);

    userData.id = id;
    await userService.Update(userData);

    response.message = "User Updated";
    response.status = 200;

    ResponseApi.WriteResponse(res, response);
  }

  async DeleteUser(req: Request, res: Response) {
    const response: responseType<User> = {
      message: "",
      status: 200,
    };

    const result = await userService.DeleteUser(parseInt(req.params.id));

    if (result === 0) {
      response.status = 400;
      response.message = "Failed to delete user";
    } else {
      response.status = 204;
    }
    ResponseApi.WriteResponse(res, response);
  }

  async login(req: Request, res: Response) {
    const login = req.body;
    const result = await userService.Login(login);
    ResponseApi.WriteResponse(res, { status: 200, data: result });
  }

  async Refresh(req: Request, res: Response) {
    const id = res.locals.id;
    const result = await userService.Refresh(id);

    ResponseApi.WriteResponse(res, { status: 200, data: result });
  }

  async Delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    const response: responseType<string> = {
      status: 200,
    };
    const result = await userService.DeleteUnverified(id);

    if (result === 0) {
      response.status = 400;
      response.message = "Failed to delete user";
    } else {
      response.status = 204;
    }

    ResponseApi.WriteResponse(res, response);
  }

  async PurchasedFonts(req: Request, res: Response) {
    const userId = Number(req.params.id);
    const {
      offset = 0,
      limit = 5,
      sortBy = "purchasedAt",
      order = "DESC",
    } = req.query;
    const result = await userService.purchasedFonts(
      userId,
      Number(offset),
      Number(limit),
      sortBy as any,
      order as any
    );

    res.send(result).status(200);
  }
}
