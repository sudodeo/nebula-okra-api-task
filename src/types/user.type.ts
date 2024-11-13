import { Document, Types } from "mongoose";

export interface User {
  id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  city: string;
  occupation: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDto
  extends Omit<User, "id" | "created_at" | "updated_at"> {}

export type UserDocument = User & Document;

export interface UserQuery {
  page: number;
  limit: number;
  sortBy: string;
  order: string;
  search: string;
}

export interface AverageAgeQuery {
  occupation: string;
  city: string;
}
