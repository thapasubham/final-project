import express from "express";

import { RoleController } from "../controller/RoleController.js";
import { Auth } from "../auth/authorization.js";
import { checkID } from "../middleware/validate.middleware";
import { PermissionType } from "../../types/permission.types.js";

const router = express.Router();

const roleController = new RoleController();
router.get(
  "/",
  Auth.isAuthorized(PermissionType.ADMIN_VIEW),
  roleController.ReadRoles
);
router.get(
  "/:id",
  Auth.isAuthorized(PermissionType.ADMIN_VIEW),
  roleController.ReadRole
);
router.post(
  "/",
  Auth.isAuthorized(PermissionType.ADMIN_ADD),
  roleController.CreateRole
);
router.put(
  "/:id",
  Auth.isAuthorized(PermissionType.ADMIN_EDIT),
  checkID,
  roleController.UpdateRole
);
router.delete(
  "/:id",
  Auth.isAuthorized(PermissionType.ADMIN_DELETE),
  checkID,
  roleController.DeleteRole
);
export const rolesRoutes = router;
