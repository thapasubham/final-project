import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

import { HttpError } from "../middleware/error.js";
import { constants } from "../../constants/constant.js";
import { RolesDB } from "../respository/roles.db.js";


export class Auth {
  static async isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const decoded_token: any = await Auth.getDecodedToken(req);
    const id = Number(req.params.id);

    const decodedID = Number(decoded_token.id);

    if (id !== decodedID) {
      throw new HttpError(
        constants.UNAUTHORIZED_MSG,
        constants.UNAUTHORIZED_STAUTS
      );
    }
    next();
  }

  static isAuthorized(permission: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const decoded_token: any = await Auth.getDecodedToken(req);
        const role = decoded_token.role;
        const decode_id = Number(decoded_token.id);
        const rolePermission = await Auth.getPermission(role, permission);
        const id = Number(req.params.id);

        if (id === decode_id || rolePermission) {
          return next();
        }

        throw new HttpError(constants.UNAUTHORIZED_MSG, 403);
      } catch (e) {
        throw new HttpError(e.message, 401);
      }
    };
  }

  static Sign(user: number, role: number) {
    const bearerToken = jwt.sign({ id: user, role: role }, process.env.SECRET, {
      expiresIn: constants.BEARER_JWT_EXP as any,
    });
    const refreshToken = jwt.sign({ id: user }, process.env.SECRET, {
      expiresIn: constants.REFRESH_JWT_EXP as any,
    });
    return { bearerToken: bearerToken, refreshToken: refreshToken };
  }

  static async Decode(token: string) {
    try {
      return jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new HttpError(e.message, 401);
    }
  }

  static async getDecodedToken(req: Request) {
    let token = req.headers.authorization;
    if (!token) {
      throw new HttpError(
        constants.UNAUTHORIZED_MSG,
        constants.UNAUTHORIZED_STAUTS
      );
    }
    token = token.split(" ")[1];

    const decoded = await Auth.Decode(token);
    return decoded;
  }

  static async getPermission(roleID: number, permission: string) {
    if (!roleID) {
      throw new HttpError("No Roles found", 401);
    }
    const roles = await RolesDB.ReadRole(roleID);
    const permissions = roles.permission;
    const rolePermission = permissions.some((p) => p.name == permission);
    return rolePermission;
  }
}
