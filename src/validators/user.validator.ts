import Joi from "joi";

export const UserValidationSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().trim(false).min(8).max(64).required(),
  dateOfBirth: Joi.date().required(),
  city: Joi.string().required().min(3),
  occupation: Joi.string().required().min(3),
});

export const UserQuerySchema = Joi.object({
  page: Joi.number().default(1),
  limit: Joi.number().default(10),
  sortBy: Joi.string().default("createdAt"),
  order: Joi.string().default("desc"),
  search: Joi.string().allow("").default(""),
});

export const UpdateUserValidationSchema = UserValidationSchema.fork(
  ["username", "email", "password", "dateOfBirth", "city", "occupation"],
  (field) => field.optional()
);
