import { Repository } from "typeorm";
import Sinon from "sinon";
import { assert } from "chai";
import {constants} from "../../constants/constant";
import { User } from "../../entity/user";
import AppDataSource from "../../data-source";
import { RolesDB } from "../../app/respository/roles.db";
import { UserDb } from "../../app/respository/user.db";

describe("User db test suite", ()=>{
    let user: User;
    let mockRepository: Sinon.SinonStubbedInstance<Repository<User>>;
    let getRepoStub: Sinon.SinonStub;
    let roleStub: Sinon.SinonStub;
    beforeEach(() => {
        mockRepository ={
            create: Sinon.stub(),
            save: Sinon.stub(),
            findOne: Sinon.stub(),
        } as any;
        UserDb.userRepository = mockRepository;
        getRepoStub = Sinon.stub(AppDataSource, "getRepository").returns(mockRepository);
        roleStub = Sinon.stub(RolesDB, "getrolebyname");
    })
    afterEach(() => {
        Sinon.restore();
    });
    it("should  save user", async () => {
        user = {
            email: "test@mail.com",
            firstname: "Test",
            id: 0,
            isDeleted: false,
            lastname: "Test",
            password: "password123",
            phoneNumber: "1233455678",
            role: 1

        }
        mockRepository.create.returns(user);
        mockRepository.save.resolves(user);

        const result = await UserDb.Createuser(user);

        assert.equal(mockRepository.create.calledOnce, true);
        assert.equal(mockRepository.save.calledOnce, true);
        assert.equal(result.firstname, "Test");

    });

    it("Should assign default role and password", async () => {
        user = {
            email: "test@mail.com",
            firstname: "Test",
            id: 0,
            isDeleted: false,
            lastname: "Test",
            phoneNumber: "1233455678",

        }
        mockRepository.create.returns(user);
        mockRepository.save.resolves(user);
    roleStub.resolves({id: 1, name: "default"})
        const result = await UserDb.Createuser(user);
        assert.equal(result.password, "password123");
        assert.equal(result.role.id , 1);
    })

    it("failed to find one user", async () => {

        mockRepository.findOne.returns(null);

        try{
         await UserDb.ReadUser(2);
        } catch (error) {
            assert.equal(error.message, constants.NO_USER);
            assert.equal(error.status, 404);
        }

    })

    it("Returns the found user" , async () => {
        user = {
            id: 2,
            firstname: "test",
            lastname:"test",
            email: "test@mail.com",
            role: {id: 3, name: "default"}
        }
        mockRepository.findOne.resolves(user);

        const result = await UserDb.ReadUser(2);
    })
})