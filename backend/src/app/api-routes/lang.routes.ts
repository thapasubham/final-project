import express from "express";
import { LangController } from "../controller/language.controller";

const route = express.Router();

const langcontroller = new LangController();
route.post("/", langcontroller.Create);
route.get("/", langcontroller.Read);
export const langRoute = route;
