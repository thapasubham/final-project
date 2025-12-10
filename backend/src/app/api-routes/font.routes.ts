import express from "express";
import { FontsController } from "../controller/font.controller.js";
import upload from "../../fileHelper/fileupload.js";
import { FontService } from "../service/fontService.js";
import { PermissionType } from "../../types/permission.types.js";
import { Auth } from "../auth/authorization.js";
const route = express.Router();

const fs = new FontService();
const fontController = new FontsController(fs);

route.get("/", fontController.ReadFonts.bind(fontController));
route.post(
  "/",
  Auth.isAuthorized(PermissionType.FONT_UPLOAD),
  upload.single("font-file"),
  fontController.CreateFont.bind(fontController)
);
route.get("/check", fontController.Filter);
export const fontRoute = route;
