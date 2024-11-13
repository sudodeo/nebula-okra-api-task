import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import { connectDB } from "../config/db";
import { UserService } from "../services/user.service";
import { User } from "../types/user.type";

const seedUsers = async () => {
  await connectDB();

  const users: User[] = [];

  const occupationArray: string[] = [];
  for (let i = 1; i <= 5; i++) {
    occupationArray.push(faker.person.jobTitle());
  }

  const cityArray: string[] = [];
  for (let i = 1; i <= 7; i++) {
    cityArray.push(faker.location.city());
  }

  for (let i = 1; i <= 50; i++) {
    users.push({
      id: new Types.ObjectId(),
      username: faker.person.fullName(),
      email: `${faker.person.firstName()}@${faker.internet.domainName()}`,
      password: faker.string.alphanumeric({ length: 9 }),
      dateOfBirth: faker.date.birthdate(),
      city: faker.helpers.arrayElement(cityArray),
      occupation: faker.helpers.arrayElement(occupationArray),
      created_at: faker.date.anytime(),
      updated_at: new Date(),
    });
  }

  try {
    const createdUsers = await UserService.createMultipleUsers(users);
    if (createdUsers.length > 0) {
      console.log(`${createdUsers.length} Users seeded successfully`);
    } else {
      console.log("Failed to seed users, try again.");
    }
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    process.exit();
  }
};

seedUsers();
