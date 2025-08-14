import type { TLoginSchemaType, TSignupSchemaType } from "@/lib/schema";
import type {
  IActiveChatMessages,
  ICreateNewChat,
  IGetCurrentUser,
  IGetUsersByUsernameQuery,
  IUserChats,
} from "@/types/api-response.type";
import type {
  IEmailVerifyResponse,
  ILoginUserResponse,
  IUserRegistrationResponse,
} from "@/types/auth-type";
import axios, { AxiosError, type AxiosResponse } from "axios";

const apiClient = axios.create({
  baseURL: "https://connectly-yssh.onrender.com/api",
  withCredentials: true,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      const response = await apiClient.get("/");
      localStorage.setItem("token", response.data.token);
      error.config.headers.Authorization = `Bearer ${response.data.token}`;
      return axios(error.config);
    }
    return Promise.reject(error);
  }
);

const errorHandler = (error: unknown) => {
  if (error instanceof AxiosError) {
    throw error;
  } else {
    throw new Error("An unexpected error occurred.");
  }
};

const registerUser = async (
  data: TSignupSchemaType
): Promise<IUserRegistrationResponse> => {
  try {
    const response = await apiClient.post("/user/create", data);
    return response.data;
  } catch (error: unknown) {
    throw errorHandler(error);
  }
};

const verifyOtp = async (data: { otp: string; email: string }) => {
  try {
    const response: AxiosResponse<IEmailVerifyResponse> = await apiClient.post(
      "/user/verify-otp",
      { ...data }
    );
    console.log("response.data verifyOtp:>> ", response.data);
    return response.data;
  } catch (error: unknown) {
    throw errorHandler(error);
  }
};

const loginUser = async (data: TLoginSchemaType) => {
  try {
    const response: AxiosResponse<ILoginUserResponse> = await apiClient.post(
      "/user/login",
      data
    );
    return response.data;
  } catch (error: unknown) {
    throw errorHandler(error);
  }
};

const getCurrentUser = async () => {
  try {
    const response: AxiosResponse<IGetCurrentUser> = await apiClient.get(
      "/user/current-user"
    );
    return response.data;
  } catch (error: unknown) {
    throw errorHandler(error);
  }
};

const getUserChats = async (): Promise<IUserChats> => {
  try {
    const response: AxiosResponse<IUserChats> = await apiClient.get("/chat");
    return response.data;
  } catch (error) {
    throw errorHandler(error);
  }
};

const getUserByUsernameQuery = async (
  query: string
): Promise<IGetUsersByUsernameQuery> => {
  try {
    const response: AxiosResponse<IGetUsersByUsernameQuery> =
      await apiClient.get(`/user/by-username?username=${query}`);
    return response.data;
  } catch (error) {
    throw errorHandler(error);
  }
};

const createNewChat = async (data: {
  userId: string;
}): Promise<ICreateNewChat> => {
  try {
    const response: AxiosResponse<ICreateNewChat> = await apiClient.post(
      "/chat",
      data
    );
    return response.data;
  } catch (error) {
    throw errorHandler(error);
  }
};

const getActiveChatMessages = async ({
  chatId,
  page,
  limit,
}: {
  chatId: string;
  page: number;
  limit: number;
}) => {
  try {
    const response: AxiosResponse<IActiveChatMessages> = await apiClient.get(
      `/message/${chatId}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw errorHandler(error);
  }
};

export {
  registerUser,
  verifyOtp,
  loginUser,
  getCurrentUser,
  getUserChats,
  getUserByUsernameQuery,
  createNewChat,
  getActiveChatMessages,
};
