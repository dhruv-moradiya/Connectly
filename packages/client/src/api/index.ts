import type { TLoginSchemaType, TSignupSchemaType } from "@/lib/schema";
import type {
  IActiveChatMessages,
  IBaseType,
  IConnections,
  ICreateGroupChat,
  ICreateNewChat,
  IGetCurrentUser,
  IGetUsersByUsernameQuery,
  IUserChats,
  IUserLogout,
} from "@/types/api-response.type";
import type {
  IEmailVerifyResponse,
  ILoginUserResponse,
  IUserRegistrationResponse,
} from "@/types/auth-type";
import axios, {
  AxiosError,
  type AxiosResponse,
  type AxiosRequestConfig,
} from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_SERVER_URL,
  withCredentials: true, // cookies included
  timeout: 10000,
});

interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request until refresh is done
        return new Promise<AxiosResponse>((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              if (token && originalRequest.headers) {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
              }
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint
        const res = await apiClient.post<{ accessToken: string }>(
          "/refresh-access-token"
        );

        const newAccessToken = res.data.accessToken;

        // Update default Authorization header
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
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

const logoutUser = async () => {
  try {
    const response: AxiosResponse<IUserLogout> = await apiClient.get(
      "/user/log-out"
    );
    return response.data;
  } catch (error) {
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

const getConnections = async () => {
  try {
    const response: AxiosResponse<IConnections> = await apiClient.get(
      "/user/direct-connections"
    );
    return response.data;
  } catch (error) {
    throw errorHandler(error);
  }
};

const createGroupChat = async (data: FormData) => {
  try {
    const response: AxiosResponse<ICreateGroupChat> = await apiClient.post(
      "/chat/group",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw errorHandler(error);
  }
};

const addUserInGroupChat = async (data: {
  userIds: string[];
  chatId: string;
}) => {
  try {
    const response: AxiosResponse<IBaseType> = await apiClient.patch(
      `/chat/${data.chatId}/add-participants`,
      { userIds: data.userIds }
    );

    return response.data;
  } catch (error) {
    throw errorHandler(error);
  }
};

export {
  createGroupChat,
  registerUser,
  verifyOtp,
  loginUser,
  logoutUser,
  getCurrentUser,
  getUserChats,
  getUserByUsernameQuery,
  createNewChat,
  getActiveChatMessages,
  getConnections,
  addUserInGroupChat,
};
