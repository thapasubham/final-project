import { Request, Response } from "express";
import { RoleService } from "../service/RoleService";
import { ResponseApi } from "../../utils/ApiResponse";

const roleService = new RoleService();
export class RoleController {
  async ReadRoles(req: Request, res: Response) {
    const result = await roleService.ReadRoles();
    ResponseApi.WriteResponse(res, { status: 200, data: result });
  }
  async CreateRole(req: Request, res: Response) {
    let role = req.body;
    role.name = role.name.toLowerCase();
    const result = await roleService.CreateRole(role);

    ResponseApi.WriteResponse(res, { status: 201, data: result });
  }
  async ReadRole(req: Request, res: Response) {
    const roleID = Number(req.params.id);
    const result = await roleService.ReadRole(roleID);

    ResponseApi.WriteResponse(res, { status: 200, data: result });
  }

  async UpdateRole(req: Request, res: Response) {
    const roleID = Number(req.params.id);
    const permissionId = req.body.permission_id;

    const result = await roleService.UpdateRole(roleID, permissionId);
    ResponseApi.WriteResponse(res, { status: 201, data: result });
  }

  async DeleteRole(req: Request, res: Response) {
    const roleID = Number(req.params.id);
    const result = await roleService.DeleteRole(roleID);
    ResponseApi.WriteResponse(res, { status: 204, data: result });
  }
}
