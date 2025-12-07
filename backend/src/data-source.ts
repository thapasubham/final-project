import "reflect-metadata";
import { DataSource } from "typeorm";
import { entities } from "./entity/table.js";

const AppDataSource = new DataSource({
  // logging: true,
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: "postgres",
  password: "subham12",
  database: "fonts",
  entities: [...entities],
  migrations: ["src/migrations/*.ts"],
});

export default AppDataSource;
