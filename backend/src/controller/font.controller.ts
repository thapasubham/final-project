import { Request, Response } from "express";
import { Font } from "../entity/font.js";
import { FontService } from "../service/fontService.js";

export class FontsController {
  fontService: FontService;
  constructor(fs: FontService) {
    this.fontService = fs;
  }
  async CreateFont(req: Request, res: Response) {
    const file = req.file;
    console.log(file.filename);
    const font = { ...req.body };
    font.fileName = file.filename;
    const result = await this.fontService.CreateFont(font);
    res.send(result);
  }

  async ReadFonts(req: Request, res: Response) {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 5;
    const { filter } = req.query;

    const filters = filter ? (filter as string).split(",") : [];

    const filename: Font[] = await this.fontService.ReadFont(
      limit,
      offset,

      filters
    );

    res.send(filename);
  }

  async Filter(req: Request, res: Response) {
    const { filter } = req.query;
    let response = (filter as string).split(",");
    res.send(response);
  }
}
