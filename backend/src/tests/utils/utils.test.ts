import { assert, expect } from "chai";
import { parseBody } from "../../utils/utils";

describe("test suite when parsing the body", () => {
  it("when the body data is passes", () => {
    let req: any = {
      body: {
        firstname: "John",
        lastname: "Doe",
        phoneNumber: 9836708367,
      },
    };
    const data = parseBody(req);
    assert.equal(data, req.body);
  });
  it("when the body is empty", () => {
    let req: any = {};
    const data = () => {
      parseBody(req);
    };
    expect(data).to.throw(Error);
  });
});
