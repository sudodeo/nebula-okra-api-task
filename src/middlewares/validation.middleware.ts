import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isValidObjectId } from "mongoose";
import { BadRequest, InvalidInput } from "./error.middleware";

export class ValidationMiddleware {
  static validateObjectId(
    id: unknown,
    _req: Request,
    _res: Response,
    next: NextFunction
  ) {
    if (!isValidObjectId(id)) {
      throw new BadRequest("invalid id passed");
    }
    next();
  }

  /**
   * @param {Object} schema - Object to be validated
   * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
   * @memberof ValidationMiddleware
   */
  static validatePayload(schema: ObjectSchema) {
    return (req: Request, _res: Response, next: NextFunction) => {
      try {
        const { error } = schema.validate(req.body, {
          abortEarly: false,
        });

        if (error) {
          const validationErrors = error.details.map(
            ({ message, context }) => ({
              message: message.replace(/['"]/g, ""),
              context,
            })
          );

          throw new InvalidInput("Invalid input", validationErrors);
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * @param {Object} schema - Object to be validated
   * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
   * @memberof ValidationMiddleware
   */
  static validateQuery(schema: ObjectSchema) {
    return (req: Request, _res: Response, next: NextFunction) => {
      try {
        const { error } = schema.validate(req.query);
        if (error) {
          const validationErrors = error.details.map(
            ({ message, context }) => ({
              message: message.replace(/['"]/g, ""),
              context,
            })
          );

          throw new BadRequest("Invalid query parameter", validationErrors);
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
