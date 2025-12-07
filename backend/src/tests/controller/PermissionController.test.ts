import Sinon from "sinon";
import { PermissionController } from "../../app/controller/PermissionController.js";
import { ResponseApi } from "../../utils/ApiResponse.js";
import { Permission } from "../../entity/role.js";
import { constants } from "../../constants/constant.js";
import { PermissionService } from "../../app/service/PermissionService.js";
import { PermissionType } from "../../types/permission.types.js";

describe("Permission controller test", () => {
  let permissionController = new PermissionController();

  let req: any;
  let res: any;
  let sendStub: Sinon.SinonStub;
  let statusStub: Sinon.SinonStub;
  let writeResponseStub: Sinon.SinonStub;

  describe("Create permission", () => {
    let createStub: Sinon.SinonStub;
    beforeEach(() => {
      createStub = Sinon.stub(PermissionService.prototype, "CreatePermission");
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

    it("Create Permission test case", async () => {
      req = {
        body: {
          name: "view",
        },
      };
      await permissionController.CreatePermission(req, res);
      Sinon.assert.calledOnce(createStub);
      Sinon.assert.calledWith(writeResponseStub, res, {
        status: 201,
        message: "Permission Created",
      });
    });
  });

  describe("Read Permission", () => {
    let readStub: Sinon.SinonStub;
    beforeEach(() => {
      readStub = Sinon.stub(PermissionService.prototype, "ReadPermissions");
      writeResponseStub = Sinon.stub(ResponseApi, "WriteResponse");
      statusStub = Sinon.stub().returnsThis();
      sendStub = Sinon.stub();
      permissionController = new PermissionController();

      res = {
        status: statusStub,
        send: sendStub,
      };
    });
    afterEach(() => {
      readStub.restore();
      writeResponseStub.restore();
    });
    it("Read Test", async () => {
      const permission: Permission[] = [
        {
          id: 1,
          name: PermissionType.ADMIN_ADD,
        },
        {
          id: 3,
          name: PermissionType.ADMIN_EDIT,
        },
        {
          id: 5,
          name: PermissionType.EDIT,
        },
      ];
      readStub.returns(permission);
      await permissionController.ReadPermissions(req, res);
      Sinon.assert.calledOnce(readStub);
      Sinon.assert.calledWith(writeResponseStub, res, {
        status: 200,
        data: permission,
      });
    });
  });

  describe("Read permission by id", () => {
    let readStub: Sinon.SinonStub;
    beforeEach(() => {
      readStub = Sinon.stub(PermissionService.prototype, "ReadPermission");
      writeResponseStub = Sinon.stub(ResponseApi, "WriteResponse");
      statusStub = Sinon.stub().returnsThis();
      sendStub = Sinon.stub();
      permissionController = new PermissionController();

      res = {
        status: statusStub,
        send: sendStub,
      };
    });
    afterEach(() => {
      readStub.restore();
      writeResponseStub.restore();
    });
    it("Read by id Test", async () => {
      req = {
        params: {
          id: 5,
        },
      };
      const permission: Permission = {
        id: 5,
        name: PermissionType.EDIT,
      };
      readStub.returns(permission);
      await permissionController.ReadPermission(req, res);
      Sinon.assert.calledOnce(readStub);
      Sinon.assert.calledWith(readStub, 5);
      Sinon.assert.calledWith(writeResponseStub, res, {
        status: 200,
        data: permission,
      });
    });
  });

  describe("Delete permission", () => {
    let updateStub: Sinon.SinonStub;
    beforeEach(() => {
      updateStub = Sinon.stub(PermissionService.prototype, "UpdatePermission");
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

    it("Delete permission test", async () => {
      req = {
        params: {
          id: "2",
        },
        body: {
          name: "moderator",
        },
      };
      updateStub.returns(1);
      await permissionController.UpdatePermission(req, res);
      Sinon.assert.calledOnce(updateStub);
      Sinon.assert.calledWith(writeResponseStub, res, {
        status: 200,
        data: 1,
      });
    });
  });

  describe("Delete permission", () => {
    let deleteStub: Sinon.SinonStub;
    beforeEach(() => {
      deleteStub = Sinon.stub(PermissionService.prototype, "DeletePermission");
      writeResponseStub = Sinon.stub(ResponseApi, "WriteResponse");
      statusStub = Sinon.stub().returnsThis();
      sendStub = Sinon.stub();
      res = {
        status: statusStub,
        send: sendStub,
      };
    });
    afterEach(() => {
      deleteStub.restore();
      writeResponseStub.restore();
    });

    it("Delete permission test", async () => {
      req = {
        params: {
          id: "5",
        },
      };
      deleteStub.returns(1);
      await permissionController.DeletePermission(req, res);
      Sinon.assert.calledOnce(deleteStub);
      Sinon.assert.calledWith(writeResponseStub, res, {
        status: 204,
        message: constants.PERMISSION_DELETED,
      });
    });
  });
});
