import express from "express";

import { UserController } from "../controller/UserController.js";
import {
  checkID,
  checkQuery,
  validate,
  validateLogin,
} from "../middleware/validate.middleware.js";
import { Auth } from "../auth/authorization.js";
import { PermissionType } from "../../types/permission.types.js";
import refreshTokenValid from "../auth/refreshToken.auth.js";
import { ValidateUnique } from "../middleware/duplicateEmail.middleware.js";
import { User } from "../../entity/user.js";

const router = express.Router();

const usersHandler = new UserController();
const unique = new ValidateUnique(User);
router.get("/", checkQuery, usersHandler.GetUsers);
router.get(
  "/:id",
  Auth.isAuthorized(PermissionType.VIEW),
  checkID,
  usersHandler.GetUser
);
router.post(
  "/",
  unique.isUnique.bind(unique),
  validate,
  usersHandler.CreateUser
);
router.post("/login", validateLogin, usersHandler.login);
router.delete(
  "/:id",

  Auth.isAuthorized(PermissionType.DELETE),
  checkID,
  usersHandler.DeleteUser
);
router.put(
  "/:id",
  Auth.isAuthorized(PermissionType.EDIT),
  checkID,
  validate,
  unique.isUnique.bind(unique),
  usersHandler.UpdateUser
);
router.delete(
  "/:id/delete/",
  Auth.isAuthorized(PermissionType.ADMIN_DELETE),
  checkID,
  usersHandler.Delete
);
router.post("/refreshToken", refreshTokenValid, usersHandler.Refresh);
export const userRouter = router;
