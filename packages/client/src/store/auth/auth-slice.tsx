import type {
  IEmailVerifyResponse,
  ILoginUserResponse,
  TUserAuth,
} from "@/types/auth-type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  emailVerifyThunk,
  getCurrentUserThunk,
  loginUserThunk,
} from "./auth-thunks";
import { showToast } from "@/lib/utils";
import type { IGetCurrentUser } from "@/types/api-response.type";

interface IAuthState {
  isAuthenticated: boolean;
  user: TUserAuth | null;
  isLoading: boolean;
  isFormLoading: boolean;
  error: string | null;
}

const initialState: IAuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  isFormLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<TUserAuth>) => {
      state.user = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(emailVerifyThunk.pending, (state) => {
      state.isLoading = true;
      state.isFormLoading = true;
    });
    builder.addCase(
      emailVerifyThunk.fulfilled,
      (state, action: PayloadAction<IEmailVerifyResponse>) => {
        state.isAuthenticated = true;
        if (action.payload.success) {
          const user = {
            ...action.payload.data.user,
            accessToken: action.payload.accessToken,
          };
          state.user = user;
        } else {
          state.user = null;
        }
        state.isLoading = false;
        state.isFormLoading = false;
        state.error = null;
      }
    );
    builder.addCase(emailVerifyThunk.rejected, (state, action) => {
      const error = (action.payload as string) || "Something went wrong";
      state.isLoading = false;
      state.isFormLoading = false;
      state.error = error;
      showToast("Email verification failed", error, "error");
    });

    builder.addCase(loginUserThunk.pending, (state) => {
      state.isLoading = true;
      state.isFormLoading = true;
    });
    builder.addCase(
      loginUserThunk.fulfilled,
      (state, action: PayloadAction<ILoginUserResponse>) => {
        state.isAuthenticated = true;
        if (action.payload.success) {
          const user = {
            ...action.payload.data.user,
            accessToken: action.payload.accessToken,
          };
          state.user = user;
        } else {
          state.user = null;
        }
        state.isLoading = false;
        state.isFormLoading = false;
        state.error = null;
      }
    );
    builder.addCase(loginUserThunk.rejected, (state, action) => {
      const error = (action.payload as string) || "Something went wrong";
      state.isLoading = false;
      state.isFormLoading = false;
      state.error = error;
      showToast("Email verification failed", error, "error");
    });

    builder.addCase(getCurrentUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      getCurrentUserThunk.fulfilled,
      (state, action: PayloadAction<IGetCurrentUser>) => {
        state.isAuthenticated = true;
        if (action.payload.success) {
          state.user = action.payload.data;
        } else {
          state.user = null;
        }
        state.isLoading = false;
        state.error = null;
      }
    );
    builder.addCase(getCurrentUserThunk.rejected, (state, action) => {
      const error = (action.payload as string) || "Something went wrong";
      state.isLoading = false;
      state.error = error;
      showToast("Email verification failed", error, "error");
    });
  },
});

const authReducer = authSlice.reducer;
export default authReducer;
export const { setCurrentUser } = authSlice.actions;
