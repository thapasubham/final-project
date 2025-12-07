import { EntityTarget, FindOptionsWhere, Not, Repository } from "typeorm";
import { NextFunction } from "express";
import { Request, Response } from "express";
import { HttpError } from "./error.js";
import { ResponseApi, responseType } from "../../utils/ApiResponse.js";
import { constants } from "../../constants/constant.js";
import AppDataSource from "../../data-source.js";

interface duplicate {
  email: string;
  phoneNumber: string;
}

export class ValidateUnique<T> {
  private repository: Repository<T>;
  constructor(repository: EntityTarget<T>) {
    this.repository = AppDataSource.getRepository(repository);
  }

  isUnique = async (req: Request, res: Response, next: NextFunction) => {
    const { id, email, phoneNumber } = req.body;
    const c_id = id ? Number(id) : -1;
    if (!email || !phoneNumber) {
      throw new HttpError("Email and phone number are required", 404);
    }

    const isEmailDuplicate = await this.UniqueEmail(email, c_id);
    const isNumberDuplicate = await this.UniquePhone(phoneNumber, c_id);

    const response: responseType<duplicate> = {
      status: 409,
    };

    const data: duplicate = {
      email: isEmailDuplicate ? isEmailDuplicate : "",
      phoneNumber: isNumberDuplicate ? isNumberDuplicate : "",
    };

    response.data = data;

    if (isEmailDuplicate || isNumberDuplicate) {
      ResponseApi.WriteResponse(res, response);
      return;
    }
    next();
  };

  async UniqueEmail(email: string, id?: number) {
    const duplicate = await this.repository.findOne({
      where: {
        id: Not(id),
        email,
      },
    } as any);

    return duplicate ? constants.EMAIL_EXISTS : false;
  }
  async UniquePhone(phoneNumber: string, id?: number) {
    const duplicate = await this.repository.findOne({
      where: {
        id: Not(id),
        phoneNumber,
      },
    } as any);
    return duplicate ? constants.PHONE_EXISTS : false;
  }
}
