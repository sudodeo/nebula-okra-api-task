import mongoose from "mongoose";
import Config from "./config";

export const connectDB = async (): Promise<void> => {
  try {
      const dbUrl = Config.mongo.url as string;
      await mongoose.connect(dbUrl);
      console.log(`Connected to MongoDB Successfully`);
  } catch (error) {
    let err = error as Error
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};