import express from "express";
import cors from "cors";
import { fontRoute } from "./api-routes/routes.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import AppDataSource from "./data-source.js";
const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const url = process.env.URL;
  console.log(url);
  app.use(
    cors({
      origin: url,
      credentials: true,
    })
  );

  app.use("/api/font", fontRoute);

  const filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(filename);
  app.use("/static", express.static(path.join(__dirname, "../static")));
  app.get("/", (req, res) => {
    res.json({ message: "Hello" });
  });

  app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  app.listen(3000, () => {
    console.log("listening at port 3000");
    console.log("Serving static from:", path.join(__dirname, "../static"));
  });
};

AppDataSource.initialize().then(() => {
  console.log("Data source initialized");
  startServer();
});
