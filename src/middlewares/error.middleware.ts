import { NextFunction, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
import { errorResponse } from "../utils/response.handler";
type MongoError = MongooseError & { code?: number };

export class HttpError extends Error {
  public status: number;
  public details: Record<string, any>;
  public code: number;
  public keyValue: Record<string, any>;

  constructor(
    statusCode: number,
    message: string,
    details: Record<string, any> = {}
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = statusCode;
    this.details = details;
    this.code = (details as { code?: number })["code"] || 0;
    this.keyValue = (details as { keyValue?: Object })["keyValue"] || {};
  }
}

export class BadRequest extends HttpError {
  constructor(message: string, details?: Object) {
    super(400, message, details);
  }
}

export class ResourceNotFound extends HttpError {
  constructor(message: string, details?: Object) {
    super(404, message, details);
  }
}

export class Unauthorized extends HttpError {
  constructor(message: string, details?: Object) {
    super(401, message, details);
  }
}

export class Forbidden extends HttpError {
  constructor(message: string, details?: Object) {
    super(403, message, details);
  }
}

export class Timeout extends HttpError {
  constructor(message: string, details?: Object) {
    super(408, message, details);
  }
}

export class Conflict extends HttpError {
  constructor(message: string, details?: Object) {
    super(409, message, details);
  }
}

export class InvalidInput extends HttpError {
  constructor(message: string, details?: Object) {
    super(422, message, details);
  }
}

export class TooManyRequests extends HttpError {
  constructor(message: string, details?: Object) {
    super(429, message, details);
  }
}

export class ServerError extends HttpError {
  constructor(message: string, details?: Object) {
    super(500, message, details);
  }
}

export const routeNotFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const message = `Route not found`;
  res
    .status(404)
    .json({ success: false, message, method: req.method, resource: req.path });
};

export const errorHandler = (
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);
  let statusCode = err.status || 500;
  let cleanedMessage = (
    statusCode === 500
      ? "Oops, looks like something went wrong. Please try again later"
      : err.message
  ).replace(/"/g, "");

  const responsePayload: any = {
    success: false,
    message: cleanedMessage,
  };

  if (err instanceof Error) {
    if (err.name === "ValidationError") {
      cleanedMessage = "Validation failed";
      responsePayload.message = err.message;
      statusCode = 422;
    } else if (err.code && err.code == 11000) {
      const field = Object.keys(err.keyValue)[0];

      cleanedMessage = "Duplicate key error";
      responsePayload.message = `${err.keyValue[field]} already exists for ${field}.`;
      statusCode = 409;
    }
  }

  let details;
  if (err.details != null) {
    details = err.details;
  }

  errorResponse(res, cleanedMessage, details, statusCode);
};

export function isMongoError(error: unknown): error is MongoError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as any).code === "number"
  );
}
