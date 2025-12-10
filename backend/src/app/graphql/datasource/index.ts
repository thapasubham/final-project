import { PermissionService } from "../../service/PermissionService";
import { RoleService } from "../../service/RoleService";
import { UserService } from "../../service/UserService";

export const gql_dataSource = {
  userService: new UserService(),
  roleService: new RoleService(),
  permissionService: new PermissionService(),
};
