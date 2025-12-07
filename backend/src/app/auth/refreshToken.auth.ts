import { HttpError } from "../middleware/error.js";
import { NextFunction, Request, Response } from "express";
import { Auth } from "./authorization.js";
import {constants} from "../../constants/constant.js";

export default async function refreshTokenValid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = req.headers.authorization;
    if (!refreshToken  ) {
      throw new HttpError(constants.EMPTY_TOKEN, 401);
    }
    if (!refreshToken.startsWith("refreshToken ")) {
      throw new HttpError(constants.EMPTY_TOKEN, 401);
    }
    const result: any = await Auth.getDecodedToken(req);

    res.locals = result;

    next();
  } catch (e) {
    throw new HttpError(e.message, e.status);
  }
}
