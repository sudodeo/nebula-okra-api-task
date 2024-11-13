import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import {
  UserQuerySchema,
  UserValidationSchema,
} from "../validators/user.validator";

const userRouter = Router();

userRouter
  .route("/")
  .get(UserController.getAllUsers)
  .post(
    ValidationMiddleware.validatePayload(UserValidationSchema),
    UserController.createUser
  );

userRouter.get("/average-age-by-city", UserController.getAverageAge);

userRouter.get("/demographics", UserController.getUserDemographics);

userRouter
  .route("/:id")
  .get(
    ValidationMiddleware.validateQuery(UserQuerySchema),
    UserController.getUser
  )
  .put(UserController.updateUser)
  .delete(UserController.deleteUser);

export default userRouter;
