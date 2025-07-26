import { getCurrentUser, loginUser, verifyOtp } from "@/api";
import type { TLoginSchemaType } from "@/lib/schema";
import type { IGetCurrentUser } from "@/types/api-response.type";
import type { IEmailVerifyResponse } from "@/types/auth-type";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

const emailVerifyThunk = createAsyncThunk(
  "auth/emailVerify",
  async (data: { otp: string; email: string }, { rejectWithValue }) => {
    try {
      const response: IEmailVerifyResponse = await verifyOtp(data);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message);
      } else {
        return rejectWithValue("An unknown error occurred.");
      }
    }
  }
);

const loginUserThunk = createAsyncThunk(
  "auth/loginUser",
  async (data: TLoginSchemaType, { rejectWithValue }) => {
    try {
      const response = await loginUser(data);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message);
      } else {
        return rejectWithValue("An unknown error occurred.");
      }
    }
  }
);

const getCurrentUserThunk = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response: IGetCurrentUser = await getCurrentUser();
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message);
      } else {
        return rejectWithValue("An unknown error occurred.");
      }
    }
  }
);

export { emailVerifyThunk, loginUserThunk, getCurrentUserThunk };
