import dotenv from "dotenv";

dotenv.config();

let configErrors: string[] = [];

const validateEmptyString = (
  value: string | undefined,
  name: string
): string => {
  if (!value || value.trim() === "") {
    configErrors.push(
      `${name} environment variable must be a nonempty string.\n`
    );
    return "";
  }
  return value;
};

const Config = {
  serverPort: process.env.PORT as string || 3598,
  mongo: {
    url: validateEmptyString(process.env.MONGO_URL, "MONGO_URL"),
  },
  BcryptSalt: parseInt(
    validateEmptyString(process.env.BCRYPT_SALT, "BCRYPT_SALT")
  ),
};

if (configErrors.length > 0) {
  throw new Error(`Invalid configuration:\n\n${configErrors.join("\n")}`);
}

export default Config;
