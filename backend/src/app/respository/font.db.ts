import AppDataSource from "../../data-source.js";
import { Font } from "../../entity/font.js";
import { Langdb } from "./lang.db.js";

const respository = AppDataSource.getRepository(Font);
export class fontdb {
  static async Update(
    fontId: number,
    updateData: Partial<Font>,
    lang_id?: number[]
  ) {
    // 1. Find existing font
    const font = await respository.findOne({
      where: { id: fontId },
      relations: ["langs"],
    });

    if (!font) {
      throw new Error(`Font with ID ${fontId} not found`);
    }

    Object.assign(font, updateData);
    if (lang_id && lang_id.length > 0) {
      const languages = await Langdb.Reads(lang_id);
      font.langs = languages;
    }

    const updatedFont = await respository.save(font);

    return updatedFont;
  }
  static async Create(font: Font, lang_id: number[]) {
    const languages = await Langdb.Reads(lang_id);
    const fontDate = respository.create({
      name: font.name,
      fileName: font.fileName,
      createdBy: font.createdBy,
      langs: languages,
    });

    const result = await respository.save(fontDate);

    return font;
  }
  static async Read(
    limit: number,
    offset: number,
    lang: string,
    search: string,
    order_by: "ASC" | "DESC",
    mostPurchased: boolean
  ) {
    let db = await respository
      .createQueryBuilder("font")
      .leftJoinAndSelect("font.langs", "language")
      // .leftJoin("font.purchases", "purchase") // join purchases table
      .where("1=1");

    if (lang) {
      db = db.andWhere("language.name = :lang", { lang });
    }

    if (search) {
      db = db.andWhere("font.name ILIKE :search", { search: `%${search}%` });
    }

    if (mostPurchased) {
      db = db
        .groupBy("font.id")
        .addGroupBy("language.id")
        .orderBy("COUNT(purchase.id)", "DESC");
    } else {
      const order = order_by === "DESC" ? "DESC" : "ASC";
      db = db.orderBy("font.name", order);
    }

    const [result, count] = await db.take(limit).skip(offset).getManyAndCount();

    return { fonts: result, count };
  }

  static async findFontById(id: number) {
    const font = await respository.findOne({
      where: { id },
    });

    if (!font) {
      throw new Error(`Font with ID ${id} not found`);
    }

    return font;
  }
}
