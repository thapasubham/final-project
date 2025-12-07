import { off } from "process";
import AppDataSource from "../../data-source.js";
import { Language } from "../../entity/font.js";
import { In } from "typeorm";

const respository = AppDataSource.getRepository(Language);
export class Langdb {
  static async Create(lang: Language) {
    const result = await respository.save(lang);
    return result;
  }
  static async Read() {
    const result = await respository.find();
    return result;
  }
  static async Reads(id: number[]) {
    const result = await respository.find({
      where: {
        id: In(id),
      },
    });
    return result;
  }
}
