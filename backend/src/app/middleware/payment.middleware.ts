import { NextFunction, Request, Response } from "express";
import { UserDb } from "../respository/user.db";
import { fontdb } from "../respository/font.db";
import AppDataSource from "../../data-source";
import { UserFont } from "../../entity/font";

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
export async function checkAlreadyPurchased(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userFontRepo = AppDataSource.getRepository(UserFont);
    const userId = Number(req.body.userID || req.body.userId);
    const fontId = Number(req.body.fontId);

    if (!userId || !fontId) {
      return res.status(400).json({ error: "Missing userID or fontId" });
    }

    const alreadyPurchased = await userFontRepo.findOne({
      where: {
        user: { id: userId },
        font: { id: fontId },
      },
    });

    if (alreadyPurchased) {
      return res
        .status(400)
        .json({ error: "You have already purchased this font." });
    }

    next(); // user has not purchased, continue
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
const userFontRepo = AppDataSource.getRepository(UserFont);

export async function checkFontPurchased(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = Number(req.params.id || req.body.userid);
    const fontId = Number(req.params.fontId || req.body.fontId);

    if (!userId || !fontId) {
      return res.status(400).json({ error: "Missing userId or fontId" });
    }

    const purchased = await userFontRepo.findOne({
      where: {
        user: { id: userId },
        font: { id: fontId },
      },
    });

    if (!purchased) {
      return res
        .status(403)
        .json({ error: "You have not purchased this font." });
    }

    next(); // user owns the font
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
