import { Request, Response, NextFunction } from "express";
import { User } from "../../entity/user.js";
import { responseType, ResponseApi } from "../../utils/ApiResponse.js";
import { parseBody } from "../../utils/utils.js";
import { login } from "../../types/login.types.js";
import { error } from "../../types/signupError.types.js";

export function validate(req: Request, res: Response, next: NextFunction) {
  const response: responseType<error> = {
    status: 200,
    message: "",
  };

  const user: User = parseBody(req);

  const result = inputValidation(user);

  const isvalid = Object.values(result).some((msg) => msg !== "");
  console.log(isvalid);
  if (isvalid) {
    console.log(res, response);
    response.status = 400;
    response.data = result;
    return ResponseApi.WriteResponse(res, response);
  }

  // res.send("Hii");
  next();
}

export function checkQuery(req: Request, res: Response, next: NextFunction) {
  const limit = Number(req.query.limit);
  const offset = Number(req.query.offset);
  if (limit >= 0 && offset >= 0) {
    next();
    return;
  }

  const errorMsg: responseType<string> = {
    status: 404,
    message: "Query not satisfied",
  };

  ResponseApi.WriteError(res, errorMsg);
}

export function checkID(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return ResponseApi.WriteError(res, {
      status: 404,
      message: "ID cannot be string",
    });
  }

  next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const response: responseType<String> = {
    status: 200,
    message: "",
  };

  const user: login = parseBody(req);
  if (!(user.email && user.password)) {
    response.message = "Missing fields";
    response.status = 400;
    ResponseApi.WriteError(res, response);
    return;
  }

  next();
}

function inputValidation(user: User) {
  const error: error = {
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
  };
  const nameRegex = /^[A-Z][a-z]*$/;
  if (!user.firstname.trim()) {
    error.firstname = "First name is required";
  } else if (!nameRegex.test(user.firstname.trim())) {
    error.firstname = "First name is not valid";
  } else {
    error.firstname = "";
  }

  if (!user.lastname.trim()) {
    error.lastname = "Last name is required";
  } else if (!nameRegex.test(user.lastname.trim())) {
    error.lastname = "Last name is not valid";
  } else {
    error.lastname = "";
  }
  if (!user.email.trim()) {
    error.email = "Email is required";
  } else if (!/^([a-z0-9_-]+@[a-z]+\.[a-z]{2,3})*$/.test(user.email.trim())) {
    error.email = "Email is not valid";
  } else {
    error.email = "";
  }
  if (!user.phoneNumber.trim()) {
    error.phoneNumber = "Phone number is required";
  } else if (isNaN(Number(user.phoneNumber.trim()))) {
    error.phoneNumber = "Phone number is invalid";
  } else if (user.phoneNumber.length !== 10) {
    error.phoneNumber = "Phone number should be 10 digits";
  } else {
    error.phoneNumber = "";
  }

  if (user.password) {
    if (user.password.length < 6 || user.password.length > 15) {
      error.password = "Password should be at least 6 to 15 characters long";
    } else {
      error.password = "";
    }
  }

  return error;
}
