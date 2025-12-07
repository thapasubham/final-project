import Sinon from "sinon";

import {assert, expect} from "chai";
import {EntityTarget,  Repository} from "typeorm";
import { constants } from "../../constants/constant";
import { ValidateUnique } from "../../app/middleware/duplicateEmail.middleware";
import { HttpError } from "../../app/middleware/error";
import AppDataSource from "../../data-source";
import { Role } from "../../entity/role";
import { User } from "../../entity/user";
import { ResponseApi } from "../../utils/ApiResponse";


describe("Validate Unique", () => {
    let validator: ValidateUnique<User>;
    let mockRepository: Sinon.SinonStubbedInstance<Repository<User>>;
    let getRepositoryStub: Sinon.SinonStub;

    const testData: User= {
        email: "test@test.com",
        phoneNumber: "1234567890",
        id: 1,
        role   : new Role(),
        firstname: "",
        lastname: "",

    };

    beforeEach(() => {
        // Create a stubbed repository
        mockRepository = {
            findOne: Sinon.stub(),
        } as unknown as Sinon.SinonStubbedInstance<Repository<User>>;

        // Stub the getRepository method
        getRepositoryStub = Sinon.stub(AppDataSource, "getRepository").returns(mockRepository);

        // Initialize validator with a fake entity
        validator = new ValidateUnique<User>("User" as EntityTarget<User>);
    });

    afterEach(() => {
        Sinon.restore();
    });

    describe("Unique method test", () => {
        it("should return false when email doesn't exist", async () => {
            mockRepository.findOne.resolves(null);
            const result = await validator.UniqueEmail(testData.email);
            assert.strictEqual(result, false);
            Sinon.assert.calledOnce(mockRepository.findOne);
        });

        it("should return error message when email exists", async () => {
            mockRepository.findOne.resolves(testData);
            const result = await validator.UniqueEmail(testData.email);
            assert.strictEqual(result, constants.EMAIL_EXISTS);
        });

        it("should exclude current ID when checking for duplicates", async () => {
            mockRepository.findOne.resolves(null);
                const result =    await validator.UniqueEmail(testData.email);

           assert.equal(result, false);
        });

        it("should return false when phone number doesn't exist", async () => {
            mockRepository.findOne.resolves(null);
            const result = await validator.UniquePhone(testData.phoneNumber);
            assert.equal(result, false);
        });

        it("should return error message when phone number exists", async () => {
            mockRepository.findOne.resolves(testData);
            const result = await validator.UniquePhone(testData.phoneNumber);
            assert.equal(result, constants.PHONE_EXISTS);
        });
    });

    describe("isUnique middleware", () => {
        let req: any;
        let res: any;
        let next: Sinon.SinonStub;
        let writeResponseStub: Sinon.SinonStub;

        beforeEach(() => {
            req = { body: { ...testData } };
            res = { status: Sinon.stub().returnsThis(), json: Sinon.stub() };
            next = Sinon.stub();
            writeResponseStub = Sinon.stub(ResponseApi, "WriteResponse");
        });

        it("should call next() when no duplicates exist", async () => {
            mockRepository.findOne.onFirstCall().resolves(null); // Email check
            mockRepository.findOne.onSecondCall().resolves(null); // Phone check

            await validator.isUnique(req , res , next);

            Sinon.assert.calledOnce(next);
            Sinon.assert.notCalled(writeResponseStub);
        });

        it("should return 409 when email exists", async () => {
            mockRepository.findOne.onFirstCall().resolves(testData);
            mockRepository.findOne.onSecondCall().resolves(null);

            req.body = {
                email: "test@test.com",
                phoneNumber: "1234567890",
            }
            await validator.isUnique(req, res , next);

            Sinon.assert.calledWith(writeResponseStub, res, {
                status: 409,
                data: {
                    email: constants.EMAIL_EXISTS,
                    phoneNumber: ""
                }
            });
            Sinon.assert.notCalled(next);
        });


        it("Should throw 404 error if empty email or phoneNumber", async () => {

            req.body ={
                email: "test@t.com",
            };
try{
            await validator.isUnique(req, res , next);
    } catch(error) {
    Sinon.assert.notCalled(writeResponseStub);
     expect(error).to.be.instanceOf(HttpError);
    expect(error.message).to.equal(constants.MISSING_UNIQUE);
    expect(error.status).to.equal(404);
}

        })
    });
});