import Sinon from "sinon";

import { assert } from "chai";
import { RoleService } from "../../app/service/RoleService";
import { RolesDB } from "../../app/respository/roles.db";
import { Role } from "../../entity/role";
import { PermissionType } from "../../types/permission.types";

describe("Role service test case", () => {
  const roleService = new RoleService();
  describe("Create role test", () => {
    let createSub: Sinon.SinonStub;
    beforeEach(() => {
      createSub = Sinon.stub(RolesDB, "CreateRole");
    });
    afterEach(() => {
      createSub.restore();
    });
    it("Create role test", async () => {
      const role: Role = {
        id: 4,
        name: "admin",
      };

      createSub.returns(role);
      const result = await roleService.CreateRole(role);
      assert.equal(result, role);
      Sinon.assert.calledOnce(createSub);
      Sinon.assert.calledWith(createSub, role);
    });
  });
  describe("read single role test", () => {
    let readRole: Sinon.SinonStub;
    beforeEach(() => {
      readRole = Sinon.stub(RolesDB, "ReadRole");
    });
    afterEach(() => {
      readRole.restore();
    });
    it("Read role by name test", async () => {
      const id = 4;
      const role: Role = {
        id: 4,
        name: "admin",
      };

      readRole.returns(role);
      const result = await roleService.ReadRole(id);
      assert.equal(result, role);
      Sinon.assert.calledOnce(readRole);
      Sinon.assert.calledWith(readRole, id);
    });
  });

  describe("read roles test", () => {
    let readRole: Sinon.SinonStub;
    beforeEach(() => {
      readRole = Sinon.stub(RolesDB, "ReadRoles");
    });
    afterEach(() => {
      readRole.restore();
    });
    it("read all  role test", async () => {
      const name = "admin";
      const role: Role[] = [
        {
          id: 4,
          name: "admin",
        },
        {
          id: 7,
          name: "user",
        },
      ];

      readRole.returns(role);
      const result = await roleService.ReadRoles();
      assert.equal(result, role);
      Sinon.assert.calledOnce(readRole);
    });
  });

  describe("Add permission to roles", () => {
    let updateStub: Sinon.SinonStub;
    before(() => {
      updateStub = Sinon.stub(RolesDB, "AddPermissionToRole");
    });
    afterEach(() => {
      updateStub.restore();
    });
    it("Add permission to role", async () => {
      const roleid = 3;
      const permission_id = 4;
      const role: Role = {
        id: 4,
        name: "HR",
        permission: [
          {
            id: 2,
            name: PermissionType.VIEW,
          },
          {
            id: 4,
            name: PermissionType.ADMIN_EDIT
          },
        ],
      };

      updateStub.returns(role);
      const result = await roleService.UpdateRole(roleid, permission_id);
      assert.equal(result, role);
      Sinon.assert.calledWith(updateStub, roleid, permission_id);
    });
  });

  describe('DeleteRole', () => {
    let deleteRoleStub: Sinon.SinonStub;

    beforeEach(() => {

      deleteRoleStub = Sinon.stub(RolesDB, 'DeleteRole');
    });

    afterEach(() => {
      deleteRoleStub.restore();
    });

    it('should delete a role and return the result', async () => {

      const roleId = 123;
      deleteRoleStub.withArgs(roleId).resolves(1);


      const result = await roleService.DeleteRole(roleId);


      assert.equal(result, 1);
    });
  });
});