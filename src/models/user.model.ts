import bcrypt from "bcryptjs";
import { model, PaginateModel, Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
import Config from "../config/config";
import { User, UserDocument } from "../types/user.type";
import { calculateAgeFromDob } from "../utils/helpers";

const userSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    city: { type: String, required: true },
    occupation: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ createdAt: 1 });
userSchema.index({ city: 1 });
userSchema.index({ occupation: 1 });

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, Config.BcryptSalt);
  }
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as User;
  return bcrypt.compare(candidatePassword, user.password);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

userSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;

  const birthDate = new Date(this.dateOfBirth);
  return calculateAgeFromDob(birthDate);
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

userSchema.plugin(paginate);

export const UserModel = model<UserDocument, PaginateModel<UserDocument>>(
  "User",
  userSchema
);
