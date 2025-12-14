import { assert } from "chai";
import { userResolvers } from "../../../app/graphql/resolvers/resolvers.user.js";
import Sinon from "sinon";

describe("User Resolver test", () => {
  let dataSource: any;
  describe("Query", () => {
    let readStub: Sinon.SinonStub;
    beforeEach(() => {
      readStub = Sinon.stub();
      dataSource = {
        userService: { ReadUser: readStub },
      };
    });

    it("User query", async () => {
      let data = {
        firstname: "Subham",
        lastname: "Thapa",
        id: 5,
        email: "subham@gmail.com",
        phoneNumber: "9876543210",
      };
      readStub.resolves(data);
      const result = await userResolvers.Query.getuser(
        {},
        { id: 5 },
        { dataSource: dataSource }
      );
      assert.equal(result, data);
      Sinon.assert.calledOnce(dataSource.userService.ReadUser);
    });

    //users
    it("User query", async () => {
      let data = [
        {
          firstname: "Subham",
          lastname: "Thapa",
          id: 5,
          email: "subham@gmail.com",
          phoneNumber: "9317543210",
        },
        {
          firstname: "Sunil",
          lastname: "Khadka",
          id: 5,
          email: "subham@gmail.com",
          phoneNumber: "9872157210",
        },
        {
          firstname: "John",
          lastname: "Black",
          id: 40,
          email: "john@black.com",
          phoneNumber: "987583210",
        },
      ];
      readStub.resolves(data);
      const result = await userResolvers.Query.getuser(
        {},
        { limit: 5, offset: 5 },
        { dataSource: dataSource }
      );
      assert.equal(result, data);
      Sinon.assert.calledOnce(dataSource.userService.ReadUser);
    });
  });

  describe("Create Mutations", () => {
    let createUserStub: Sinon.SinonStub;
    beforeEach(() => {
      createUserStub = Sinon.stub();
      dataSource = {
        userService: { CreateUser: createUserStub },
      };
    });

    it("User Create mutation", async () => {
      let data = {
        firstname: "Subham",
        lastname: "Thapa",
        id: 5,
        email: "subham@gmail.com",
        phoneNumber: "9876543210",
      };
      createUserStub.resolves(data);
      const result = await userResolvers.Mutation.createUser(
        {},
        { data },
        { dataSource: dataSource }
      );
      assert.equal(result, data);
      Sinon.assert.calledOnce(dataSource.userService.CreateUser);
    });
  });

  describe("Update mutation", () => {
    let updateStub: Sinon.SinonStub;
    beforeEach(() => {
      updateStub = Sinon.stub();
      dataSource = {
        userService: { Update: updateStub },
      };
    });

    it("User update mutation", async () => {
      let data = {
        firstname: "John",
        lastname: "Spencer",
        id: 10,
        email: "spencer@john.com",
        phoneNumber: "9876543210",
      };
      updateStub.resolves(data);

      const result = await userResolvers.Mutation.updateUser(
        {},
        { data },
        { dataSource: dataSource }
      );
      assert.equal(result, data);
      Sinon.assert.calledOnce(dataSource.userService.Update);
    });
  });

  describe("Update Mutations", () => {
    let deleteStub: Sinon.SinonStub;
    beforeEach(() => {
      deleteStub = Sinon.stub();
      dataSource = {
        userService: { DeleteUser: deleteStub },
      };
    });

    it("update user mutation", async () => {
      let id = 11;

      deleteStub.resolves(1);
      const result = await userResolvers.Mutation.deleteUser(
        {},
        { id },
        { dataSource: dataSource }
      );
      assert.equal(result, 1);
      Sinon.assert.calledOnce(dataSource.userService.DeleteUser);
    });
  });
});
