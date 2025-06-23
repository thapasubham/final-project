import "reflect-metadata";
import { DataSource } from "typeorm";
import { Font } from "./entity/font.js";

const AppDataSource = new DataSource({
  logging: true,
  type: "postgres",
  host: "localhost",
  port: 8000,
  username: "postgres",
  password: "subham12",
  database: "fonts",
  entities: [Font],
  migrations: ["src/migrations/*.ts"],
});

export default AppDataSource;
