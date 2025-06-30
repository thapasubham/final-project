import "reflect-metadata";
import { DataSource } from "typeorm";
import { Font, Language } from "./entity/font.js";

const AppDataSource = new DataSource({
  // logging: true,
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: "postgres",
  password: "subham12",
  database: "fonts",
  entities: [Font, Language],
  migrations: ["src/migrations/*.ts"],
});

export default AppDataSource;
