import { constants } from "../../constants/constant";
import Sinon from "sinon";
import { UserController } from "../../app/controller/UserController";
import { UserService } from "../../app/service/UserService";
import { Role } from "../../entity/role";
import { ResponseApi } from "../../utils/ApiResponse";


describe("User controller tests ", () => {
  const userController = new UserController();
  let req: any;
  let res: any;
  let sendStub: Sinon.SinonStub;
  let statusStub: Sinon.SinonStub;
  let writeResponseStub: Sinon.SinonStub;

  describe("User create test suites", () => {
    let createUserStub: Sinon.SinonStub;

    //setup
    beforeEach(() => {
      createUserStub = Sinon.stub(
        UserService.prototype,
        "CreateUser"
      ).resolves();
      writeResponseStub = Sinon.stub(ResponseApi, "WriteResponse");
      statusStub = Sinon.stub().returnsThis();
      sendStub = Sinon.stub();

      res = {
        status: statusStub,
        send: sendStub,
      };
    });

    //teardown
    afterEach(() => {
      createUserStub.restore();
      writeResponseStub.restore();
    });


    it("Create user Test case", async () => {
      const user = {
        id: 5,
        firstname: "Subham",
        lastname: "Thapa",
        email: "subham@thapa.com",
        phoneNumber: "9874563210",
        role: 2,
      };

      req = {
        body: {
        ...user
        },
      };

      await userController.CreateUser(req, res);
      Sinon.assert.calledOnce(createUserStub);
      Sinon.assert.calledWith(createUserStub, user );
      Sinon.assert.calledOnce(writeResponseStub);
      Sinon.assert.calledWith(writeResponseStub, res, {
        status: 201,
        message: "User Created",
      });
    });
  });

  describe("Delete User test suite", () => {
    let deleteUserstub: Sinon.SinonStub;

    //setup
    beforeEach(() => {
      deleteUserstub = Sinon.stub(
        UserService.prototype,
        "DeleteUser"
      ).resolves();
      writeResponseStub = Sinon.stub(ResponseApi, "WriteResponse");
      statusStub = Sinon.stub().returnsThis();
      sendStub = Sinon.stub();

      res = {
        status: statusStub,
        send: sendStub,
      };
    });

    //teardown
    afterEach(() => {
      deleteUserstub.restore();
      writeResponseStub.restore();
    });

    //testing
    it("Failed to Delete User", async () => {
      req = {
        params: {
          id: "10",
        },
      };
      deleteUserstub.returns(0);
      const userData = [
        {
          firstname: "Test",
          lastname: "test",
          id: 5,
          email: "test@test.com",
          phoneNumber: "7482135964",
          role: new Role(),
        },
        {
          firstname: "John",
          lastname: "Black",
          id: 6,
          email: "johnblack",
          phoneNumber: "3246895214",
          role: new Role(),
        },
      ];

      deleteUserstub.returns(0);
      await userController.DeleteUser(req, res);

      Sinon.assert.calledOnce(deleteUserstub);
      Sinon.assert.calledWith(deleteUserstub, 10);

      Sinon.assert.calledOnce(writeResponseStub);
      Sinon.assert.calledWith(writeResponseStub, res, {
        status: 400,
        message: "Failed to delete user",
      });
    });
    it("Delete User", async () => {
      req = {
        params: {
          id: "5",
        },
      };
      deleteUserstub.returns(1);
      const userData = [
        {
          firstname: "Test",
          lastname: "user",
          id: 5,
          email: "test@user.com",
          phoneNumber: "7153486248",
          role: new Role(),
        },
        {
          firstname: "John",
          lastname: "Black",
          id: 6,
          email: "john@black.com",
          phoneNumber: "1724853694",
          role: new Role(),
        },
      ];
      await userController.DeleteUser(req, res);

      Sinon.assert.calledOnce(deleteUserstub);
      Sinon.assert.calledWith(deleteUserstub, 5);

      Sinon.assert.calledOnce(writeResponseStub);
      Sinon.assert.calledWith(writeResponseStub, res, {
        status: 204,
        message: "",
      });
    });
  });

  //read user test cases
  describe("Read user test suits", () => {
    let readUserStub: Sinon.SinonStub;
    let readUsersStub: Sinon.SinonStub;

    //setup
    beforeEach(() => {
      readUsersStub = Sinon.stub(UserService.prototype, "ReadUsers").resolves();
      readUserStub = Sinon.stub(UserService.prototype, "ReadUser").resolves();

      writeResponseStub = Sinon.stub(ResponseApi, "WriteResponse");
      statusStub = Sinon.stub().returnsThis();
      sendStub = Sinon.stub();

      res = {
        status: statusStub,
        send: sendStub,
      };
    });

    //teardown
    afterEach(() => {
      readUsersStub.restore();
      readUserStub.restore();
      writeResponseStub.restore();
    });
    describe("Get users test suite", () => {
      it("No User exists", async () => {
        req = {
          query: {
            filter: "firstname",
            limit: "1",
            offset: " 5",
          },
        };
        readUsersStub.returns([]);
        await userController.GetUsers(req, res);
        Sinon.assert.calledOnce(readUsersStub);
        Sinon.assert.calledWith(
          readUsersStub,
          undefined,
          undefined,
          "firstname",
          1,
          5,
          undefined
        );

        Sinon.assert.calledOnce(writeResponseStub);
        Sinon.assert.calledWith(writeResponseStub, res, {
          status: 404,
          message: constants.NO_MORE_USER,
        });
      });
      it("Users exists", async () => {
        req = {
          query: {
            select: "",
            selectBy: "",
            filter: "",
            orderBy: "",
            limit: "1",
            offset: "5",
          },
        };
        let userData = [
          {
            firstname: "Subham",
            lastname: "Thapa",
            id: 6,
            email: "subham@thapa.com",
            phoneNumber: "986541275",
            role: new Role(),
          },
          {
            firstname: "John",
            lastname: "Pork",
            id: 40,
            email: "",
            phoneNumber: "",
            role: new Role(),
          },
          {
            firstname: "Lee",
            lastname: "Smith",
            id: 80,
            email: "le@smith.com",
            phoneNumber: "9821745630",
            role: new Role(),
          },
        ];
        readUsersStub.returns(userData);
        await userController.GetUsers(req, res);
        Sinon.assert.calledOnce(readUsersStub);
        Sinon.assert.calledWith(
          readUsersStub,
          undefined,
          undefined,
          "",

          1,
          5,
          ""
        );

        Sinon.assert.calledOnce(writeResponseStub);
        Sinon.assert.calledWith(writeResponseStub, res, {
          status: 200,
          data: userData,
        });
      });
    });

    //single user test case
    describe("Single user test suite", () => {
      //user exists
      it("Userexists", async () => {
        let user = {
          firstname: "subham",
          lastname: "thapa",
          id: 4,
          email: "subham@thapa.com",
          phoneNumber: "9412589634",
          role: new Role(),
        };
        req = {
          params: {
            id: "4",
          },
        };
        readUserStub.returns([user]);
        await userController.GetUser(req, res);
        Sinon.assert.calledOnce(readUserStub);
        Sinon.assert.calledWith(readUserStub, 4);

        Sinon.assert.calledOnce(writeResponseStub);
        Sinon.assert.calledWith(writeResponseStub, res, {
          status: 200,
          data: [user],
        });
      });
    });
  });

  //test the update feature
  describe("Update user test suite", () => {
    let updateStub: Sinon.SinonStub;

    //setup
    beforeEach(() => {
      updateStub = Sinon.stub(UserService.prototype, "Update").resolves();
      writeResponseStub = Sinon.stub(ResponseApi, "WriteResponse");
      statusStub = Sinon.stub().returnsThis();
      sendStub = Sinon.stub();

      res = {
        status: statusStub,
        send: sendStub,
      };
    });

    //teardown
    afterEach(() => {
      updateStub.restore();
      writeResponseStub.restore();
    });

    it("Update the user", async () => {
      req = {
        body: {
          firstname: "Subham",
          lastname: "Thapa",
          phoneNumber: "9854752314",
        },
        params: {
          id: "10",
        },
      };

      updateStub.returns(1);
      await userController.UpdateUser(req, res);
      Sinon.assert.calledOnce(updateStub);
      Sinon.assert.calledWith(writeResponseStub, res, {
        message: "User Updated",
        status: 200,
      });
    });
  });

  describe("login test", () => {
    let loginStub: Sinon.SinonStub;

    beforeEach(() => {
      loginStub = Sinon.stub(UserService.prototype, "Login");

      writeResponseStub = Sinon.stub(ResponseApi, "WriteResponse");
      statusStub = Sinon.stub().returnsThis();
      sendStub = Sinon.stub();

      res = {
        status: statusStub,
        send: sendStub,
      };
    });
    after(() => {
      Sinon.restore();
    });
    it("Epic test", async () => {
      req = {
        body: { email: "subham@gmail.com" },
      };
      const data = {
        accessToken: "accessToken",
        refreshToken: "refreshToken",
      };
      loginStub.returns(data);
      await userController.login(req, res);

      Sinon.assert.calledWith(writeResponseStub, res, {
        status: 200,
        data: data,
      });
    });
  });

  describe("Refresh user", () => {
    let refreshStub: Sinon.SinonStub;
    beforeEach(() => {
      refreshStub= Sinon.stub(UserService.prototype, "Refresh").resolves();
      writeResponseStub = Sinon.stub(ResponseApi, "WriteResponse");
      statusStub = Sinon.stub().returnsThis();
      sendStub = Sinon.stub();
      res = {
        status: statusStub,
        send: sendStub,
      };
    })
    afterEach(()=>{
      refreshStub.restore();
      writeResponseStub.restore();
    })
    it("Refresh the user", async () => {
      res = {
        locals: {
          id: 4
        }
      }
      const data = {
        accessToken: "accessToken",
        refreshToken: "refreshToken",
      };
      refreshStub.returns(data);
      await userController.Refresh(req, res);
      Sinon.assert.calledOnce(refreshStub);
      Sinon.assert.calledWith(writeResponseStub, res, {status:200, data: data });
      Sinon.assert.calledOnce(writeResponseStub);
    })
  })

  describe('Delete user', () => {
    let deleteStub: Sinon.SinonStub;
    beforeEach(() => {
      deleteStub = Sinon.stub(UserService.prototype, "DeleteUser").resolves();
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
    it("Failed to delete the mentor", async () => {
      req = {

        params: {
          id: "1",
        },
      };

      deleteStub.returns(0);
      await userController.DeleteUser(req, res);
      Sinon.assert.calledOnce(deleteStub);
      Sinon.assert.calledWith(writeResponseStub, res, {
        message: "Failed to delete user",
        status: 400,
      });
    });
    it("Delete the mentor", async () => {
      req = {
        params: {
          id: "8",
        },
      };

      deleteStub.returns(1);
      await userController.DeleteUser(req, res);
      Sinon.assert.calledOnce(deleteStub);
      Sinon.assert.calledWith(writeResponseStub, res, {
        message: "",
        status: 204,
      });
    });
  })


  describe("Delete unverified user", () => {
    let deleteStub: Sinon.SinonStub;
    beforeEach(() => {
      deleteStub = Sinon.stub(UserService.prototype, "DeleteUnverified").resolves();
      statusStub = Sinon.stub().returnsThis();
      sendStub = Sinon.stub();
      writeResponseStub = Sinon.stub(ResponseApi, "WriteResponse");
      res = {
        status: statusStub,
        send: sendStub,
      };
    })

    afterEach(() => {
      writeResponseStub.restore();
      deleteStub.restore();
    })
    it("Delete Unverified user", async () => {
      req = {
        params: {
          id: "8",
        },
      };

      deleteStub.resolves(1);
      await userController.Delete(req, res);
      Sinon.assert.calledOnce(deleteStub);
      Sinon.assert.calledWith(writeResponseStub, res, {status: 204})
    })

    it("Failed to delete unverified user", async () => {
      req = {
        params: {
          id: "8",
        },
      };

      deleteStub.resolves(0);
      await userController.Delete(req, res);
      Sinon.assert.calledOnce(deleteStub);
      Sinon.assert.calledWith(writeResponseStub, res, { message: 'Failed to delete user',status: 400})
    })
  })
});
