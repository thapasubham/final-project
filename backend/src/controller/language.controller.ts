import { Request, Response } from "express";
import { LangService } from "../service/langService";
import { Language } from "../entity/font";
const langService = new LangService();
export class LangController {
  async Create(req: Request, res: Response) {
    const lang = req.body;
    const result = await langService.Create(lang);
    res.send(result);
  }
  async Read(req: Request, res: Response) {
    const result = await langService.Read();
    res.send(result);
  }
}
