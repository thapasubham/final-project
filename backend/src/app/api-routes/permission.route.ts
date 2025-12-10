import express from "express";
import { PermissionController } from "../controller/PermissionController.js";
import { checkID } from "../middleware/validate.middleware.js";
import { PermissionType } from "../../types/permission.types.js";
import { Auth } from "../auth/authorization.js";
import { isValidPermission } from "../middleware/validate.permission.js";

const router = express.Router();

const permissionController = new PermissionController();
router.get(
  "/",
  Auth.isAuthorized(PermissionType.ADMIN_VIEW),
  permissionController.ReadPermissions
);
router.get(
  "/:id",
  Auth.isAuthorized(PermissionType.ADMIN_VIEW),
  checkID,
  permissionController.ReadPermission
);
router.post(
  "/",
  Auth.isAuthorized(PermissionType.ADMIN_ADD),
  isValidPermission,
  permissionController.CreatePermission
);
router.delete(
  "/:id",
  Auth.isAuthorized(PermissionType.ADMIN_DELETE),
  checkID,
  permissionController.DeletePermission
);
router.put(
  "/:id",
  Auth.isAuthorized(PermissionType.ADMIN_EDIT),
  checkID,
  permissionController.UpdatePermission
);

export const permissionRoutes = router;
