import { Language } from "../entity/font.js";
import { Langdb } from "../respository/lang.db.js";

export class LangService {
  async Create(lang: Language) {
    const result = await Langdb.Create(lang);
    return result;
  }
  async Read() {
    const result = await Langdb.Read();
    return result;
  }
}
