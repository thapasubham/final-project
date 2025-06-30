import AppDataSource from "../data-source.js";
import { Font } from "../entity/font.js";
import { Langdb } from "./lang.db.js";

const respository = AppDataSource.getRepository(Font);
export class fontdb {
  static async Create(font: Font, lang_id: number[]) {
    const languages = await Langdb.Reads(lang_id);
    const fontDate = respository.create({
      name: font.name,
      fileName: font.fileName,
      langs: languages,
    });

    const result = await respository.save(fontDate);

    return result;
  }

  static async Read(
    limit: number,
    offset: number,
    lang: string,
    search: string,
    order_by: "ASC" | "DESC"
  ) {
    let db = await respository
      .createQueryBuilder("font")
      .leftJoinAndSelect("font.langs", "language")
      .where("1=1"); // <-- base always-true condition

    if (lang) {
      db = db.andWhere("language.name = :lang", { lang });
    }

    if (search) {
      db = db.andWhere("font.name ILIKE :search", { search: `%${search}%` });
    }

    const order = order_by === "DESC" ? "DESC" : "ASC";

    const [result, count] = await db
      .take(limit)
      .skip(offset)
      .orderBy("font.name", order)
      .getManyAndCount();

    return { fonts: result, count };
  }
}
