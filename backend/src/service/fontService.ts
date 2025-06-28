import { Font } from "../entity/font";
import { fontdb } from "../respository/font.db";
import { Langdb } from "../respository/lang.db";

export class FontService {
  async CreateFont(font: Font, lang_id: number[]) {
    const result = await fontdb.Create(font, lang_id);
    return result;
  }

  async ReadFont(
    limit: number,
    offset: number,
    lang: string,
    search: string,
    order_by: "ASC" | "DESC"
  ) {
    const result = await fontdb.Read(limit, offset, lang, search, order_by);
    return result;
  }
}
