import Sinon from "sinon";
import { Permission } from "../../entity/role.js";
import { permissionDB } from "../../app/respository/permission.db";
import { assert } from "chai";
import { PermissionService } from "../../app/service/PermissionService.js";
describe("Permission service test case", () => {
  const permissionService = new PermissionService();

  describe("Create Permission", () => {
    let createSub: Sinon.SinonStub;
    beforeEach(() => {
      createSub = Sinon.stub(permissionDB, "CreatePermission");
    });
    afterEach(() => {
      createSub.restore();
    });
    it("Create permission test case", async () => {
      const permission: Permission = {
        name: "role:view",
      };
      createSub.returns(permission);
      const result = await permissionService.CreatePermission(permission);
      assert.equal(result, permission);
      Sinon.assert.calledOnce(createSub);
      Sinon.assert.calledWith(createSub, permission);
    });
  });

  describe("Read Permission", () => {
    let readStub: Sinon.SinonStub;
    beforeEach(() => {
      readStub = Sinon.stub(permissionDB, "ReadPermission");
    });
    afterEach(() => {
      readStub.restore();
    });
    it("Read permission by id test case", async () => {
      const id = 1;
      const permission: Permission = {
        id: 3,
        name: "view",
      };
      readStub.returns(permission);
      const result = await permissionService.ReadPermission(id);
      assert.equal(result, permission);
      Sinon.assert.calledOnce(readStub);
      Sinon.assert.calledWith(readStub, id);
    });
  });
  describe("Read multiple Permission", () => {
    let readStub: Sinon.SinonStub;
    beforeEach(() => {
      readStub = Sinon.stub(permissionDB, "ReadPermissions");
    });
    afterEach(() => {
      readStub.restore();
    });
    it("Read permissions case", async () => {
      const permission: Permission[] = [
        {
          id: 1,
          name: "add",
        },
        {
          id: 3,
          name: "view",
        },
        {
          id: 5,
          name: "edit",
        },
      ];
      readStub.returns(permission);
      const result = await permissionService.ReadPermissions();
      assert.equal(result, permission);
      Sinon.assert.calledOnce(readStub);
    });
  });
  describe("Update Permission", () => {
    let updateStub: Sinon.SinonStub;
    beforeEach(() => {
      updateStub = Sinon.stub(permissionDB, "UpdatePermission");
    });
    afterEach(() => {
      updateStub.restore();
    });
    it("Update permission case", async () => {
      const permission: Permission = {
        id: 4,
        name: "view",
      };
      updateStub.returns(1);
      const result = await permissionService.UpdatePermission(permission);
      assert.equal(result, 1);
      Sinon.assert.calledOnce(updateStub);
      Sinon.assert.calledWith(updateStub, permission);
    });
  });

  describe("Delete Permission", () => {
    let deleteStub: Sinon.SinonStub;
    beforeEach(() => {
      deleteStub = Sinon.stub(permissionDB, "DeletePermission");
    });
    afterEach(() => {
      deleteStub.restore();
    });
    it("Delete permission test case", async () => {
      const id = 4;
      const permission: Permission = {
        id: 4,
        name: "add",
      };
      deleteStub.returns(1);
      const result = await permissionService.DeletePermission(4);
      assert.equal(result, 1);
      Sinon.assert.calledOnce(deleteStub);
      Sinon.assert.calledWith(deleteStub, id);
    });
  });
});
