import { Request, Response } from "express";
import { Font } from "../entity/font.js";
import { FontService } from "../service/fontService.js";

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
      console.log(font);
      const result = await this.fontService.CreateFont(font, lang_id);
      res.send(result);
    } catch (e) {
      res.send(e.message);
    }
  }

  async ReadFonts(req: Request, res: Response) {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 5;
    const { lang } = req.query;

    const langs = lang as string;
    console.log(langs);
    const filename = await this.fontService.ReadFont(limit, offset, langs);
    console.log(filename.count);
    res.send(filename);
  }

  async Filter(req: Request, res: Response) {
    const { filter } = req.query;
    let response = (filter as string).split(",");
    res.send(response);
  }
}
