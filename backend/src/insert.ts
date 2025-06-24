import { DataSource, In } from "typeorm";
import { Font, Language } from "./entity/font";
import * as fs from "fs";
import AppDataSource from "./data-source";

async function run() {
  await AppDataSource.initialize()
    .then(() => console.log("Data source initialized"))
    .catch((err) => {
      console.error("Failed to initialize data source", err);
      process.exit(1);
    });
  try {
    const fileData = fs.readFileSync("static/font.json", "utf8");
    const fontData = JSON.parse(fileData);

    const fontRepo = AppDataSource.getRepository(Font);
    const langRepo = AppDataSource.getRepository(Language);

    for (const fontItem of fontData) {
      const languages = await langRepo.find({
        where: {
          id: In(fontItem.lang_id),
        },
      });
      const font = fontRepo.create({
        name: fontItem.name,
        fileName: fontItem.fileName,
        langs: languages,
      });

      const result = await fontRepo.save(font);
      console.log(result.name + "saved");
    }
  } catch (e) {
    console.log(e.message);
  }
  await AppDataSource.destroy();
}
run();
