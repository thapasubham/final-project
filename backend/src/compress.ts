import * as fs from "fs";
import * as path from "path";
import ttf2woff2 from "ttf2woff2";

const folder = "./static"; // folder containing .ttf/.otf fonts

function convertAll() {
  const files = fs.readdirSync(folder);

  for (const file of files) {
    if (!file.endsWith(".ttf") && !file.endsWith(".otf")) continue;

    const inputPath = path.join(folder, file);
    const outputPath = inputPath.replace(path.extname(file), ".woff2");

    const input = fs.readFileSync(inputPath);
    const output = ttf2woff2(input);

    fs.writeFileSync(outputPath, Buffer.from(output));
    console.log(`✔ Converted: ${file} → ${path.basename(outputPath)}`);
  }
}

convertAll();
