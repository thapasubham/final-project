import { Font } from "../entity/font";
import { fontdb } from "../respository/font.db";

export class FontService {
  async CreateFont(font: Font) {
    const result = await fontdb.Create(font);
    return result;
  }

  async ReadFont(limit: number, offset: number, filter: string[]) {
    console.log(limit, offset, filter);
    const result = await fontdb.Read(limit, offset, filter);
    return result;
  }
}
