import { Router } from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Request, Response } from "express";

import { checkFontPurchased } from "../middleware/payment.middleware.js";
import { Auth } from "../auth/authorization.js";
import { fontdb } from "../respository/font.db.js";
// import balls from "../../../static"
const router = Router();

const __dirname = dirname(fileURLToPath(import.meta.url));

router.get(
  "/download/:fontId/:id",
  Auth.isAuthenticated,
  checkFontPurchased as any,
  async (req: Request, res: Response) => {
    try {
      const fontId = Number(req.params.fontId);
      console.log(fontId, typeof fontId);
      const font = await fontdb.findFontById(fontId);
      if (!font) return res.status(404).json({ error: "Font not found" });

      const filePath = path.join(__dirname, "../../../static", font.fileName);
      res.download(filePath, font.fileName);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Could not download font." });
    }
  }
);

export const downloadRouter = router;
