import Sinon from "sinon";
import { errorHandler } from "../../app/middleware/error.js";
import { ResponseApi } from "../../utils/ApiResponse.js";

describe("Middleware tests", () => {
  let req: any;
  let res: any;
  let error: any;
  let sendStub: Sinon.SinonStub;
  let statusStub: Sinon.SinonStub;
  let writeErrorStub: Sinon.SinonStub;
  let callback: Sinon.SinonStub;

  beforeEach(() => {
    writeErrorStub = Sinon.stub(ResponseApi, "WriteError");
    callback = Sinon.stub();
    sendStub = Sinon.stub().returnsThis();
    statusStub = Sinon.stub();

    res = {
      status: statusStub,
      send: sendStub,
    };
  });

  afterEach(() => {
    writeErrorStub.restore();
  });
  describe("Validate test suite", () => {
    it("Error message is given", () => {
      error = {
        message: "Custom Error Occured",
      };
      req = {};
      errorHandler(error, req, res, callback);
      Sinon.assert.calledOnce(writeErrorStub);
      Sinon.assert.calledWith(writeErrorStub, res, {
        message: error.message,
        status: 500,
      });
    });
    it("Error message isnt given", () => {
      error = {
        message: "",
      };
      req = {};
      errorHandler(error, req, res, callback);
      Sinon.assert.calledOnce(writeErrorStub);
      Sinon.assert.calledWith(writeErrorStub, res, {
        message: "Internal Server Error",
        status: 500,
      });
    });
  });
});
