import { Response } from "express";

export function successResponse(
  res: Response,
  data: any,
  message: string,
  code: number = 200
): Response {
  return res.status(code).json({ success: true, data: data, message: message });
}

export function errorResponse(
  res: Response,
  message: string,
  details: Record<string,any> | string = "",
  code: number
) {
  return res.status(code).json({ success: false, message, details });
}
