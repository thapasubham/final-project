import { Request, NextFunction, Response } from "express";
import { responseType, ResponseApi } from "../../utils/ApiResponse.js";

export class HttpError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

export function errorHandler(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const response: responseType<string> = {
    message: err.message || "Internal Server Error",
    status: err.status || 500,
  };

  return ResponseApi.WriteError(res, response);
}
