import bcrypt from "bcrypt";
import { HttpError } from "../middleware/error.js";
import { constants } from "../../constants/constant.js";
export class PasswordHasher {
  static async Hash(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, constants.SALT);
    return hashedPassword;
  }

  static async Compare(password: string, hashedPassword: string) {
    const result = await bcrypt.compare(password, hashedPassword);
    if (!result) {
      throw new HttpError(constants.PASSWORD_DOESNT_MATCH, 401);
    }
  }
}
