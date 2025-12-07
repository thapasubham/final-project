import { Response } from "express";

/**
 * Generic response type used for success or error API responses.
 */
export interface responseType<T> {
  data?: T;
  status: number;
  message?: string;
}

/**
 * A utility class to for API responses.
 */
export class ResponseApi {
  /**
   * Sends a successful response to the client.
   *
   * @template T - The type of the response data.
   * @param {Response} res - The Express response object.
   * @param {responseType<T>} v - The response payload containing status, data, or message.
   *
   * @example
   *
   * //For response with data
   * const data = { id: 1, name: "John" };
   * ResponseApi.WriteResponse(res, { status: 200, data });
   *
   * //For response with message
   * const message ="User Created"
   * ResponseApi.WriteResponse(res, {status: 200, message: message})
   */
  static WriteResponse<T>(res: Response, v: responseType<T>) {
    res.status(v.status).send(v.data ? v.data : { message: v.message });
  }

  /**
   * Sends an error response to the client.
   *
   * @template T - The type of additional error data (if any).
   * @param {Response} res - The Express response object.
   * @param {responseType<T>} e - The error payload containing status and message.
   *
   * @example
   * ResponseApi.WriteError(res, { status: 500, message: "Internal server error" });
   */
  static WriteError<T>(res: Response, e: responseType<T>) {
    res.status(e.status).send({ message: e.message });
  }
}
