import express from "express";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import AppDataSource from "./data-source.js";
import routes from "./app/api-routes/index.js";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import typeDefs from "./app/graphql/schema.js";
import { resolvers } from "./app/graphql/resolvers/index.js";
import { errorHandler } from "./app/middleware/error.js";
import cookieparser from "cookie-parser";
import {
  seedAdminRole,
  seedAdminUser,
  seedPermission,
  seedUserRole,
} from "./seed/seed.js";
import { gql_dataSource } from "./app/graphql/datasource/index.js";
import { seedUsers } from "./seed/seedUser.js";

async function startServer() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const frontendUrl = process.env.URL || "http://localhost:5000";

  app.use(
    cors({
      origin: frontendUrl, // must match frontend exactly
      credentials: true, // allow cookies/auth headers
    })
  );
  app.use("/api/font", routes.fontRoute);
  app.use("/api/lang", routes.langRoute);
  app.use("/api/payment", routes.payment);

  app.use("/api/users", routes.userRouter);
  app.use("/api/roles", routes.rolesRoutes);
  app.use("/api/permission", routes.permissionRoutes);
  app.use(express.json());
  app.use(cookieparser());

  const server = new ApolloServer({ typeDefs, resolvers });

  //graphql
  await server.start();

  app.use(
    "/api/graphql",
    expressMiddleware(server, {
      context: async () => ({
        dataSource: gql_dataSource,
      }),
    }) as any
  );

  app.use(errorHandler as any);

  const filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(filename);
  app.use("/static", express.static(path.join(__dirname, "../static")));

  app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  app.listen(3000, () => {
    console.log("listening at port 3000");
    console.log("Serving static from:", path.join(__dirname, "../static"));
  });
}

AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");
    seedUserRole();
    seedPermission();
    seedAdminRole();
    startServer();
    seedAdminUser();
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
