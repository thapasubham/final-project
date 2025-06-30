import { Request, Response } from "express";
import { Font } from "../entity/font.js";
import { FontService } from "../service/fontService.js";
import { fonts } from "../const.js";

export class FontsController {
  fontService: FontService;
  constructor(fs: FontService) {
    this.fontService = fs;
  }
  async CreateFont(req: Request, res: Response) {
    try {
      const file = req.file;
      let { lang_id, ...font } = req.body;
      lang_id = lang_id.map((id: number) => Number(id));
      font.fileName = file.filename;
      const result = await this.fontService.CreateFont(font, lang_id);
      res.send(result);
    } catch (e) {
      res.send(e.message);
    }
  }

  async ReadFonts(req: Request, res: Response) {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 5;
    const { lang, search, order_by } = req.query;

    const langs = lang as string;
    const fileName = await this.fontService.ReadFont(
      limit,
      offset,
      langs,
      search as string,
      order_by as "ASC" | "DESC"
    );
    res.send(fileName);
  }

  async Filter(req: Request, res: Response) {
    const { filter } = req.query;
    let response = (filter as string).split(",");
    res.send(response);
  }
}
