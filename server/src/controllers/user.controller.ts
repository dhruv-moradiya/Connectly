import mongoose from "mongoose";
import { type Request, type Response, type NextFunction } from "express";

import ChatRoom from "@/models/chat.model";
import User from "@/models/user.model";
import Otp from "@/models/otp.model";

import { HttpStatus, PROFILE_PICS } from "@/constants";

import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { validateRequest } from "@/utils/validateRequest";
import { sendEmailVerificationEmail } from "@/utils/emails";
import { formatErrorMessages, setAuthCookies } from "@/utils";

import {
  createNewUserSchema,
  loginUserSchema,
  verifyOtpSchema,
} from "@/schemas/schema";
import {
  type ICreateNewUserBody,
  type ILoginUserBody,
  type IVerifyOtpBody,
} from "@/schemas/schema";

const generateAccessAndRefreshTokens = async (
  userId: mongoose.Types.ObjectId
): Promise<{ accessToken: string; refreshToken: string }> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

const generateNewOtp = async (): Promise<string> => {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join(
    ""
  );
};

const createNewUser = asyncHandler(
  async (req: Request<{}, {}, ICreateNewUserBody>, res: Response) => {
    // 1. Validate request body
    const validation = validateRequest(createNewUserSchema, req.body);
    if (!validation.success) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ApiResponse(
            HttpStatus.BAD_REQUEST,
            "Invalid input. Please check your fields.",
            { errors: validation.error }
          )
        );
    }

    const { email, password, username, bio } = validation.data;

    // 2. Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ApiResponse(
            HttpStatus.BAD_REQUEST,
            existingUser.email === email
              ? "An account with this email already exists."
              : "Username is already taken. Please try a different one."
          )
        );
    }

    const session = await User.startSession();
    session.startTransaction();

    try {
      // 3. Create and save new user
      const newUser = new User({
        email,
        password,
        username,
        bio,
        avatar: PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)],
      });

      await newUser.save({ session });

      // 4. Generate OTP
      const otp = await generateNewOtp();

      const newOtp = new Otp({
        email,
        otp,
        purpose: "verify_email",
      });

      await newOtp.save({ session });

      // 5. Send email verification
      await sendEmailVerificationEmail({
        to: "dmoradiya443@gmail.com",
        username,
        otp,
        otpValidity: 10, // minutes or however you're measuring
      });

      // 6. Commit the transaction
      await session.commitTransaction();

      return res
        .status(HttpStatus.CREATED)
        .json(
          new ApiResponse(
            HttpStatus.CREATED,
            "Account created! Please check your email to verify your account."
          )
        );
    } catch (error) {
      await session.abortTransaction();
      console.error("Error during user creation:", error);

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Something went wrong while creating the account. Please try again later."
          )
        );
    } finally {
      session.endSession();
      console.log("MongoDB session ended.");
    }
  }
);

const loginUser = asyncHandler(
  async (req: Request<{}, {}, ILoginUserBody>, res: Response) => {
    // 1. Validate request body
    const validation = validateRequest(loginUserSchema, req.body);
    if (!validation.success) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ApiResponse(
            HttpStatus.BAD_REQUEST,
            `Validation failed: ${formatErrorMessages(validation.error)}`,
            { errors: validation.error }
          )
        );
    }

    const { username, password } = validation.data;

    // 2. Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ApiResponse(
            HttpStatus.BAD_REQUEST,
            "Incorrect username or password. Please try again."
          )
        );
    }

    // 3. Validate password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ApiResponse(
            HttpStatus.BAD_REQUEST,
            "Incorrect username or password. Please try again."
          )
        );
    }

    // 4. Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id as mongoose.Types.ObjectId
    );

    const isProd = process.env.NODE_ENV === "production";

    setAuthCookies({
      res,
      accessToken,
      refreshToken,
      isProd,
    });

    // 6. Send response
    return res.status(HttpStatus.OK).json(
      new ApiResponse(
        HttpStatus.OK,
        "Welcome back! You’ve logged in successfully.",
        {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            isEmailVerified: user.isEmailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          accessToken,
        }
      )
    );
  }
);

const verifyOtp = asyncHandler(
  async (req: Request<{}, {}, IVerifyOtpBody>, res: Response) => {
    // 1. Validate request
    const validation = validateRequest(verifyOtpSchema, req.body);
    if (!validation.success) {
      console.log("validation.error :>> ", validation.error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ApiResponse(
            HttpStatus.BAD_REQUEST,
            `Validation failed: ${formatErrorMessages(validation.error)}`,
            { errors: validation.error }
          )
        );
    }

    const { otp, email } = req.body;

    // 2. Find matching OTP
    const otpRecord = await Otp.findOne({
      email,
      purpose: "verify_email",
    });

    if (!otpRecord) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ApiResponse(
            HttpStatus.BAD_REQUEST,
            "The OTP provided is incorrect or has expired or has already been used. Please try again or request a new one."
          )
        );
    }

    // 3. Find associated user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json(
          new ApiResponse(
            HttpStatus.NOT_FOUND,
            "We couldn't find an account associated with this email."
          )
        );
    }

    // 4. Validate OTP (check if it matches and is not used)
    const isOtpValid = await otpRecord.compareOtp(otp);
    if (!isOtpValid) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ApiResponse(
            HttpStatus.BAD_REQUEST,
            "The OTP entered is invalid. Please double-check and try again."
          )
        );
    }

    if (otpRecord.isUsed) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ApiResponse(
            HttpStatus.BAD_REQUEST,
            "This OTP has already been used. Please request a new one."
          )
        );
    }

    // 5. Update user and OTP record
    user.isEmailVerified = true;
    user.last_seen = new Date();
    otpRecord.isUsed = true;

    await user.save();
    await Otp.deleteOne({ _id: otpRecord._id });

    // 6. Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id as mongoose.Types.ObjectId
    );

    // 7. Set cookies
    const isProd = process.env.NODE_ENV === "production";

    setAuthCookies({
      res,
      accessToken,
      refreshToken,
      isProd,
    });

    // 8. Respond with success
    return res.status(HttpStatus.OK).json(
      new ApiResponse(
        HttpStatus.OK,
        "Your email has been successfully verified!",
        {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            isEmailVerified: user.isEmailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          accessToken,
        }
      )
    );
  }
);

const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(
        new ApiError(
          "Unauthorized: Refresh token not found. Please log in again.",
          401
        )
      );
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
      return next(
        new ApiError(
          "Unauthorized: Refresh token not found. Please log in again.",
          401
        )
      );
    }

    const accessToken = await user.generateAccessToken();

    const isProd = process.env.NODE_ENV === "production";

    setAuthCookies({
      res,
      accessToken,
      refreshToken,
      isProd,
    });

    return res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(HttpStatus.OK, "Access token refreshed successfully.")
      );
  }
);

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.user;

  const user = await User.findById(_id)
    .select("-password -refreshToken -__v")
    .lean();

  return res.status(HttpStatus.OK).json(
    new ApiResponse(HttpStatus.OK, "User fetched successfully", {
      ...user,
      accessToken: req.cookies.accessToken,
    })
  );
});

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(100);

  return res.status(HttpStatus.OK).json(
    new ApiResponse(HttpStatus.OK, "Users fetched successfully", {
      users,
    })
  );
});

const getUserByUsernameQuery = asyncHandler(
  async (req: Request<{}, {}, {}, { username: string }>, res: Response) => {
    const { username } = req.query;
    if (username && !username.trim()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new ApiResponse(
            HttpStatus.BAD_REQUEST,
            "Username query cannot be empty."
          )
        );
    }

    const userNaverDidChatThatUsers = await ChatRoom.aggregate([
      {
        $match: {
          "participants.user": {
            $ne: new mongoose.Types.ObjectId(req.user._id),
          },
        },
      },
      {
        $project: {
          participants: 1,
        },
      },
      {
        $unwind: "$participants",
      },
      {
        $lookup: {
          from: "users",
          localField: "participants.user",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
      {
        $match: {
          "userData.username": { $regex: username, $options: "i" },
          "userData.isEmailVerified": true,
        },
      },
      {
        $group: {
          _id: "$userData._id",
          username: { $first: "$userData.username" },
          avatar: { $first: "$userData.avatar" },
          bio: { $first: "$userData.bio" },
          email: { $first: "$userData.email" },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    console.log("userNaverDidChatThatUsers :>> ", userNaverDidChatThatUsers);

    return res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(
          HttpStatus.OK,
          "User fetched successfully",
          userNaverDidChatThatUsers
        )
      );
  }
);

export {
  createNewUser,
  loginUser,
  verifyOtp,
  getAllUsers,
  refreshAccessToken,
  getCurrentUser,
  getUserByUsernameQuery,
};
