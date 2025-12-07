import Sinon from "sinon";
import { RoleController } from "../../app/controller/RoleController.js";
import { ResponseApi } from "../../utils/ApiResponse.js";
import { Role } from "../../entity/role";
import { RoleService } from "../../app/service/RoleService.js";

describe("Roles Controller test", () => {
  const roleController = new RoleController();
  let req: any;
  let res: any;
  let sendStub: Sinon.SinonStub;
  let statusStub: Sinon.SinonStub;
  let writeResponseStub: Sinon.SinonStub;

  describe("Create role", () => {
    let createStub: Sinon.SinonStub;
    beforeEach(() => {
      createStub = Sinon.stub(RoleService.prototype, "CreateRole").resolves();
      writeResponseStub = Sinon.stub(ResponseApi, "WriteResponse");
      statusStub = Sinon.stub().returnsThis();
      sendStub = Sinon.stub();

      res = {
        status: statusStub,
        send: sendStub,
      };
    });
    afterEach(() => {
      createStub.restore();
      writeResponseStub.restore();
    });
    it("Create role test", async () => {
      const result = { id: 3, name: "admin" };
      req = {
        body: {
          name: "admin",
        },
      };
      createStub.returns(result);
      await roleController.CreateRole(req, res);
      Sinon.assert.calledOnce(createStub);
      Sinon.assert.calledWith(writeResponseStub, res, {
        status: 201,
        data: result,
      });
    });
  });

  describe("Read roles", () => {
    let readStub: Sinon.SinonStub;
    beforeEach(() => {
      readStub = Sinon.stub(RoleService.prototype, "ReadRoles").resolves();
      writeResponseStub = Sinon.stub(ResponseApi, "WriteResponse");
      statusStub = Sinon.stub().returnsThis();
      sendStub = Sinon.stub();

      res = {
        status: statusStub,
        send: sendStub,
      };
    });
    afterEach(() => {
      readStub.restore();
      writeResponseStub.restore();
    });
    it("Read Roles", async () => {
      const result: Role[] = [
        {
          id: 3,
          name: "admin",
        },
        {
          id: 4,
          name: "user",
        },
        {
          id: 5,
          name: "moderator",
        },
      ];
      readStub.returns(result);
      await roleController.ReadRoles(req, res);
      Sinon.assert.calledOnce(readStub);
      Sinon.assert.calledWith(writeResponseStub, res, {
        status: 200,
        data: result,
      });
    });
  });

  describe("Read role", () => {
    let readStub: Sinon.SinonStub;
    beforeEach(() => {
      readStub = Sinon.stub(RoleService.prototype, "ReadRole").resolves();
      writeResponseStub = Sinon.stub(ResponseApi, "WriteResponse");
      statusStub = Sinon.stub().returnsThis();
      sendStub = Sinon.stub();

      res = {
        status: statusStub,
        send: sendStub,
      };
    });
    afterEach(() => {
      readStub.restore();
      writeResponseStub.restore();
    });
    it("Read Roles", async () => {
      const id = 4;
      req = {
        params: {
          id: 4,
        },
      };
      const result: Role = {
        id: 4,
        name: "hr",
      };
      readStub.returns(result);
      await roleController.ReadRole(req, res);
      Sinon.assert.calledOnce(readStub);
      Sinon.assert.calledWith(readStub, id);
      Sinon.assert.calledWith(writeResponseStub, res, {
        status: 200,
        data: result,
      });
    });
  });

  describe("Update permission in role ", () => {
    let updateStub: Sinon.SinonStub;
    beforeEach(() => {
      updateStub = Sinon.stub(RoleService.prototype, "UpdateRole").resolves();
      writeResponseStub = Sinon.stub(ResponseApi, "WriteResponse");
      statusStub = Sinon.stub().returnsThis();
      sendStub = Sinon.stub();

      res = {
        status: statusStub,
        send: sendStub,
      };
    });
    afterEach(() => {
      updateStub.restore();
      writeResponseStub.restore();
    });
    it("Update permission in Role", async () => {
      const name = "hr";
      const permissions = [
        {
          id: 2,
          name: "add",
        },
        {
          id: 6,
          name: "view",
        },
      ];
      req = {
        params: {
          id: 1,
        },
        body: {
          permission_id: 6,
        },
      };
      const role: Role = {
        id: 1,
        name: "hr",
      };
      role.permission = permissions;
      const result: Role = role;
      updateStub.returns(result);
      await roleController.UpdateRole(req, res);
      Sinon.assert.calledOnce(updateStub);
      Sinon.assert.calledWith(updateStub, 1, 6);
      Sinon.assert.calledWith(writeResponseStub, res, {
        status: 201,
        data: result,
      });
    });
  });
});
