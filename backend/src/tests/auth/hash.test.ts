import {assert, expect} from 'chai';
import bcrypt from 'bcrypt';
import { constants } from '../../constants/constant';
import {PasswordHasher} from "../../app/auth/hash";
import Sinon from "sinon";
import {HttpError} from "../../app/middleware/error";

describe('PasswordHasher', () => {

    let bcryptHashStub: Sinon.SinonStub;
    let bcryptCompareStub: Sinon.SinonStub;

    beforeEach(() => {
        // Stub bcrypt methods
        bcryptHashStub = Sinon.stub(bcrypt, 'hash');
        bcryptCompareStub = Sinon.stub(bcrypt, 'compare');
    });

    afterEach(() => {
        bcryptHashStub.restore();
        bcryptCompareStub.restore()    });

    describe('Hash()', () => {
        it('should return a hashed password', async () => {
            const plainPassword = 'password123';
            const mockHashedPassword = '$2b$10$fakehashedpassword';
            bcryptHashStub.resolves(mockHashedPassword);

            const result = await PasswordHasher.Hash(plainPassword);

            assert.equal(result, mockHashedPassword);
            Sinon.assert.calledOnce(bcryptHashStub);
            Sinon.assert.calledWith(bcryptHashStub, plainPassword, constants.SALT);
        });


    });

    describe('Compare()', () => {
        it('should not throw when passwords match', async () => {
            const plainPassword = 'password123';
            const hashedPassword = 'fakehashedpassword';
            bcryptCompareStub.resolves(true);
            await PasswordHasher.Compare(plainPassword, hashedPassword);

        });



        it('should throw HttpError when passwords dont match', async () => {
            const plainPassword = 'wrongpassword';
            const hashedPassword = "wrongPassword";
            bcryptCompareStub.resolves(false);

            try {
                await PasswordHasher.Compare(plainPassword, hashedPassword);
            } catch (error) {
                expect(error).to.be.instanceOf(HttpError);
                expect(error.message).to.equal(constants.PASSWORD_DOESNT_MATCH);
            }
        });
    });
});