import { NextFunction, Request, Response } from "express";
import { HttpError } from "./error";
import { PermissionType } from "../../types/permission.types";

export function isValidPermission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.body.name) {
    throw new HttpError("Body not satisfied", 406);
  }

  const name = req.body.name;

  if (Object.values(PermissionType).includes(name)) {
    next();
    return;
  }
  throw new HttpError(
    "Failed to add permission. The permission type doesnt match.",
    406
  );
}
