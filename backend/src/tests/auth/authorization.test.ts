import Sinon from "sinon";
import jwt from "jsonwebtoken";
import { PermissionType } from "../../types/permission.types";
import { Role } from "../../entity/role";
import { RolesDB } from "../../app/respository/roles.db";
import { Auth } from "../../app/auth/authorization";
import { assert, expect } from "chai";
import { HttpError } from "../../app/middleware/error";
import { constants } from "../../constants/constant";

describe("Auth Middleware class ", () => {
  let req: any;
  let res: any;
  let next: Sinon.SinonSpy;
  let verifyStub: Sinon.SinonStub;
  let getPermissionStub: Sinon.SinonStub;

  describe("", () => {
    beforeEach(() => {
      req = { headers: {}, params: {} };
      res = {};
      next = Sinon.spy();
      verifyStub = Sinon.stub(jwt, "verify");
      getPermissionStub = Sinon.stub(Auth, "getPermission");
    });

    afterEach(() => {
      getPermissionStub.restore();
      verifyStub.restore();
    });

    describe("Authentication", () => {
      it("the id in param and jwt doesnt match", async () => {
        req = {
          headers: {
            authorization: "Bearer faketoken",
          },
          params: {
            id: 1234,
          },
        };
        verifyStub.returns({ id: 13234, role: "edit" });
        try {
          await Auth.isAuthenticated(req, res, next);
        } catch (data) {
          expect(data).to.instanceOf(HttpError);
          assert.equal(data.message, constants.UNAUTHORIZED_MSG);
        }
      });

      it("id match and call next function", async () => {
        req = {
          headers: {
            authorization: "Bearer faketoken",
          },
          params: {
            id: 1234,
          },
        };
        verifyStub.returns({ id: 1234, role: "help" });
        await Auth.isAuthenticated(req, res, next);
        Sinon.assert.calledOnce(next);
      });
    });

    describe("Authorization ", () => {
      it("throws error if no Authorization header", async () => {
        const middleware = Auth.isAuthorized("view");

        try {
          await middleware(req, res, next);
        } catch (err) {
          expect(err).to.be.instanceOf(HttpError);
          expect(err.message).to.equal(constants.UNAUTHORIZED_MSG);
        }
      });

      it("calls next() if token is valid and id matches", async () => {
        req = {
          headers: {
            authorization: "Bearer faketoken",
          },
          params: {
            id: "123",
          },
        };
        verifyStub.returns({ id: "123", role: "user" });
        getPermissionStub.returns(["view", "edit"]);
        const middleware = Auth.isAuthorized("view");
        await middleware(req, res, next);

        Sinon.assert.calledOnce(next);
      });

      it("throws error if id does not match and role is not admin", async () => {
        req = {
          headers: {
            authorization: "Bearer faketoken",
          },
          params: {
            id: "251",
          },
        };
        verifyStub.returns({ id: "123", role: "user" });

        const middleware = Auth.isAuthorized("view");

        try {
          await middleware(req, res, next);
        } catch (err) {
          expect(err).to.be.instanceOf(HttpError);
          expect(err.message).to.equal("Unauthorized to perform the task.");
        }
      });

      it("calls next() if role is admin even if id does not match", async () => {
        req = {
          headers: {
            authorization: "Bearer faketoken",
          },
          params: {
            id: "120",
          },
        };
        verifyStub.returns({ id: "123", role: "admin" });
        getPermissionStub.returns(["view", "edit"]);
        const middleware = Auth.isAuthorized("view");
        await middleware(req, res, next);

        Sinon.assert.calledOnce(next);
      });

      it("throws error when token is invalid", async () => {
        req = {
          headers: {
            authorization: "Bearer faketoken",
          },
        };
        verifyStub.throws(new HttpError("Invalid Token"));
        getPermissionStub.returns(["view"]);
        const middleware = Auth.isAuthorized("view");

        try {
          await middleware(req, res, next);
        } catch (err) {
          expect(err).to.be.instanceOf(HttpError);
          expect(err.message).to.equal("Invalid Token");
        }
      });
    });
    describe("Sign Test", () => {
      let signStub: Sinon.SinonStub;
      beforeEach(() => {
        signStub = Sinon.stub(jwt, "sign");
      });

      afterEach(() => {
        signStub.restore();
      });

      it("Signing test", () => {
        const bearerToken = "bearerToken";
        const refreshToken = "bearerToken";

        Auth.Sign(892834, 4);

        Sinon.assert.calledTwice(signStub);
      });
    });
  });

  describe("Get Permission", () => {
    let readRoleStub: Sinon.SinonStub;
    let roleID = 4;

    const permission = PermissionType.ADMIN_ADD;
    const role: Role = {
      id: 4,
      name: "admin",
      permission: [
        {
          id: 1,
          name: PermissionType.ADMIN_ADD,
        },
        {
          id: 4,
          name: PermissionType.ADMIN_VIEW,
        },
      ],
    };
    beforeEach(() => {
      readRoleStub = Sinon.stub(RolesDB, "ReadRole");
    });
    afterEach(() => {
      readRoleStub.restore();
    });
    it("Get permission test", async () => {
      readRoleStub.returns(role);

      const result = await Auth.getPermission(roleID, permission);
      assert.equal(result, true);
    });

    it("when the roleID is missing", async () => {
      roleID = undefined;
      try {
        await Auth.getPermission(roleID, permission);
      } catch (err) {
        expect(err.message).to.equal("No Roles found");
      }
    });
  });
});
