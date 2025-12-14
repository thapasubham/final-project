import { Font } from "../../entity/font";
import { fontdb } from "../respository/font.db";

export class FontService {
  async CreateFont(font: Font, lang_id: number[]) {
    console.log(font);
    const result = await fontdb.Create(font, lang_id);
    return result;
  }

  async ReadFont(
    limit: number,
    offset: number,
    lang: string,
    search: string,
    order_by: "ASC" | "DESC",
    mostPurchased: boolean
  ) {
    const result = await fontdb.Read(
      limit,
      offset,
      lang,
      search,
      order_by,
      mostPurchased
    );
    return result;
  }
}
