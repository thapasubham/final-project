import { Font } from "../entity/font";
import { fontdb } from "../respository/font.db";
import { Langdb } from "../respository/lang.db";

export class FontService {
  async CreateFont(font: Font, lang_id: number[]) {
    const result = await fontdb.Create(font, lang_id);
    return result;
  }

  async ReadFont(limit: number, offset: number, lang: string[]) {
    const result = await fontdb.Read(limit, offset, lang);
    return result;
  }
}
