import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { BadRequest, ResourceNotFound } from "../middlewares/error.middleware";
import { UserService } from "../services/user.service";
import { AverageAgeQuery, UserQuery } from "../types/user.type";
import { successResponse } from "../utils/response.handler";

export class UserController {
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers(
        req.query as unknown as UserQuery
      );

      successResponse(res, users, "Users fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUser(new Types.ObjectId(req.params.id));

      successResponse(res, user, "User fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await UserService.createUser(req.body);

      successResponse(res, newUser, "User created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedUser = await UserService.updateUser(
        new Types.ObjectId(req.params.id),
        req.body
      );

      if (!updatedUser) {
        throw new ResourceNotFound("User not found");
      }
      successResponse(res, updatedUser, "User updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = new Types.ObjectId(req.params.id);
      if (!userId) {
        throw new BadRequest("userId missing");
      }
      const deletedUser = UserService.deleteUser(userId);
      if (!deletedUser) {
        throw new ResourceNotFound("User not found");
      }

      successResponse(res, null, "User deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getAverageAge(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, message } = await UserService.getAverageAge(
        req.query as unknown as AverageAgeQuery
      );

      successResponse(res, data, message);
    } catch (error) {
      next(error);
    }
  }

  static async getUserDemographics(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await UserService.getUserDemographics();

      successResponse(res, data, "User demographics fetched successfully");
    } catch (error) {
      next(error);
    }
  }
}
