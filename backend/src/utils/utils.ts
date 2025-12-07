import { Request } from "express";

export function parseBody(req: Request) {
  if (!req.body) {
    throw new Error("Request body is empty");
  }
  const payload = req.body;
  return payload;
}