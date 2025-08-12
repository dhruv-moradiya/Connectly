import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";

import { type IUserSchema } from "@monorepo/shared/src/types/user.types";

interface IUserSchemaDocument extends IUserSchema, Document {
  comparePassword(password: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
}

const UserSchema = new Schema<IUserSchemaDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 160,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "FriendRequest",
      },
    ],
    blockedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    last_seen: Date,
    refreshToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

UserSchema.index({ username: 1, email: 1 }, { unique: true });

UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
  } else {
    next();
  }
});

UserSchema.methods.comparePassword = function (
  candidatePassword: string
): boolean {
  return bcrypt.compareSync(candidatePassword, this.password);
};

UserSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      avatar: this.avatar,
      bio: this.bio,
    },
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: "1d",
    }
  );
};

UserSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign({ _id: this._id }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
};

UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.refreshToken;
  delete userObject.__v;
  return userObject;
};

const User = mongoose.model<IUserSchemaDocument>("User", UserSchema);
export default User;
