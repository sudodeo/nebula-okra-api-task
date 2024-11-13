import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import Config from "../config/config";
import { UserModel } from "../models/user.model";
import {
  AverageAgeQuery,
  CreateUserDto,
  User,
  UserQuery,
} from "../types/user.type";
import { calculateAgeFromDob } from "../utils/helpers";

export class UserService {
  /**
   * Retrieves all users with optional pagination and search.
   * @param queryParams - The query parameters for pagination and search.
   * @returns A paginated result of users.
   */
  static async getAllUsers(queryParams: UserQuery) {
    const { page, limit, sortBy, search } = queryParams;

    const query: Record<string, string | number | object> = {};
    if (search) {
      query["username"] = { $regex: search, $options: "i" };
    }
    const options = {
      page: page || 1,
      limit: limit || 10,
      sort: { [sortBy]: "asc" },
    };
    const paginateResult = await UserModel.paginate(query, options);
    return paginateResult;
  }

  /**
   * Retrieves a user by their ID.
   * @param id - The ID of the user to retrieve.
   * @returns The user object if found, otherwise null.
   */
  static async getUser(id: Types.ObjectId) {
    return UserModel.findById(id);
  }

  /**
   * Creates a new user.
   * @param payload - The data for the new user.
   * @returns The created user object.
   */
  static async createUser(payload: CreateUserDto) {
    return await UserModel.create(payload);
  }

  /**
   * Updates an existing user's details.
   * @param id - The ID of the user to update.
   * @param updateUserPayload - The data to update the user with.
   * @returns The updated user object.
   */
  static async updateUser(
    id: Types.ObjectId,
    updateUserPayload: Partial<User>
  ) {
    return UserModel.findByIdAndUpdate(id, updateUserPayload, { new: true });
  }

  /**
   * Deletes a user by their ID.
   * @param id - The ID of the user to delete.
   * @returns The deleted user object if found, otherwise null.
   */
  static async deleteUser(id: Types.ObjectId) {
    return UserModel.findByIdAndDelete(id);
  }

  /**
   * Calculates the average age of users based on optional filters.
   * @param queryParams - The query parameters for filtering by occupation and city.
   * @returns The average age and a message.
   */
  static async getAverageAge(queryParams: AverageAgeQuery) {
    const { occupation, city } = queryParams;
    const query: Record<string, string | object> = {};

    let filterString = "all users";
    if (occupation) {
      query["occupation"] = occupation;
      filterString = `${occupation} users`;
    }
    if (city) {
      query["city"] = city;
      filterString = `users in ${city}`;
    }

    if (occupation && city) {
      filterString = `${occupation} users in ${city}`;
    }

    const users = await UserModel.find(query);
    if (users.length === 0) {
      return {
        data: 0,
        message: "No users found with the specified criteria.",
      };
    }

    const totalAge = users.reduce((total, user) => {
      const birthDate = new Date(user.dateOfBirth);
      let age = calculateAgeFromDob(birthDate);
      return total + age;
    }, 0);

    const averageAge = totalAge / users.length;
    return {
      data: averageAge,
      message: `Average age for ${filterString} calculated successfully.`,
    };
  }

  /**
   * Retrieves user demographics including age distribution, city stats, and occupation stats.
   * @returns An object containing age distribution, top cities, and top occupations.
   */
  static async getUserDemographics() {
    const [ageDistribution, cityStats, occupationStats] = await Promise.all([
      // 1. Age distribution analysis
      UserModel.aggregate([
        {
          $project: {
            age: {
              $floor: {
                $divide: [
                  { $subtract: [new Date(), "$dateOfBirth"] },
                  365 * 24 * 60 * 60 * 1000,
                ],
              },
            },
          },
        },
        {
          $bucket: {
            groupBy: "$age",
            boundaries: [0, 18, 25, 35, 45, 55, 65, 100],
            default: "Other",
            output: {
              totalCount: { $sum: 1 },
            },
          },
        },
        {
          $project: {
            ageBracket: {
              $switch: {
                branches: [
                  { case: { $lt: ["$_id", 18] }, then: "Under 18" },
                  { case: { $lt: ["$_id", 25] }, then: "18-24" },
                  { case: { $lt: ["$_id", 35] }, then: "25-34" },
                  { case: { $lt: ["$_id", 45] }, then: "35-44" },
                  { case: { $lt: ["$_id", 55] }, then: "45-54" },
                  { case: { $lt: ["$_id", 65] }, then: "55-64" },
                  { case: { $gte: ["$_id", 65] }, then: "65+" }
                ],
                default: "Other"
              }
            },
            totalCount: 1,
            _id: 0
          }
        }
      ]),

      // 2. City demographics
      UserModel.aggregate([
        {
          $group: {
            _id: "$city",
            userCount: { $sum: 1 },
            occupations: { $addToSet: "$occupation" },
            averageAge: {
              $avg: {
                $floor: {
                  $divide: [
                    { $subtract: [new Date(), "$dateOfBirth"] },
                    365 * 24 * 60 * 60 * 1000,
                  ],
                },
              },
            },
          },
        },
        {
          $project: {
            city: "$_id",
            userCount: 1,
            occupationDiversity: { $size: "$occupations" },
            averageAge: 1,
            _id: 0,
          },
        },
        { $sort: { userCount: -1 } },
        { $limit: 10 },
      ]),

      // 3. Occupation analysis
      UserModel.aggregate([
        {
          $group: {
            _id: "$occupation",
            count: { $sum: 1 },
            averageAge: {
              $avg: {
                $floor: {
                  $divide: [
                    { $subtract: [new Date(), "$dateOfBirth"] },
                    365 * 24 * 60 * 60 * 1000,
                  ],
                },
              },
            },
            cities: { $addToSet: "$city" },
          },
        },
        {
          $project: {
            occupation: "$_id",
            count: 1,
            averageAge: 1,
            _id: 0,
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    return {
      ageDistribution,
      topCities: cityStats,
      topOccupations: occupationStats,
    };
  }

  /**
   * Creates multiple users with hashed passwords.
   * @param users - An array of user objects to create.
   * @returns The result of the insert operation.
   */
  static async createMultipleUsers(users: User[]) {
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(
          user.password,
          Config.BcryptSalt
        );
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    return UserModel.insertMany(hashedUsers);
  }
}
