import { NextFunction, Request, Response } from "express";
import { UserDb } from "../respository/user.db";
import { fontdb } from "../respository/font.db";

export async function userExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req.body);
  const userID = Number(req.params.userID || req.body.userID);

  if (!userID) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const user = await UserDb.ReadUser(userID);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  next();
}

export async function fontExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const fontId = Number(req.params.fontId || req.body.fontId);

  if (!fontId) {
    return res.status(400).json({ message: "Font ID is required" });
  }

  const font = await fontdb.findFontById(fontId);

  if (!font) {
    return res.status(404).json({ message: "Font not found" });
  }

  next();
}
