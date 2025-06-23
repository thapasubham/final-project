import { off } from "process";
import AppDataSource from "../data-source.js";
import { Font } from "../entity/font.js";

const respository = AppDataSource.getRepository(Font);
export class fontdb {
  static async Create(font: Font) {
    const result = await respository.save(font);
    console.log(result);
    return result;
  }

  static async Read(limit: number, offset: number, filter: string[]) {
    const db = await respository.createQueryBuilder("font");
    if (filter.length > 0) {
      console.log("skibidi toilet");
    }

    console.log(limit, offset);
    const result = await db.limit(limit).offset(offset).getMany();
    console.log(result);
    return result;
  }
}
