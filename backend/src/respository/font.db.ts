import AppDataSource from "../data-source.js";
import { Font } from "../entity/font.js";
import { Langdb } from "./lang.db.js";

const respository = AppDataSource.getRepository(Font);
export class fontdb {
  static async Create(font: Font, lang_id: number[]) {
    console.log(font);

    const languages = await Langdb.Reads(lang_id);
    console.log(languages);
    const fontDate = respository.create({
      name: font.name,
      fileName: font.fileName,
      langs: languages,
    });
    console.log(fontDate);
    const result = await respository.save(fontDate);
    console.log(result);
    return result;
  }

  static async Read(limit: number, offset: number, lang: string[]) {
    let db = await respository
      .createQueryBuilder("font")
      .leftJoinAndSelect("font.langs", "language");

    if (lang.length > 0) {
      db = db.where("language.name IN (:...name)", { name: lang });
    }

    const [result, count] = await db.take(limit).skip(offset).getManyAndCount();
    return { fonts: result, count: count };
  }
}
