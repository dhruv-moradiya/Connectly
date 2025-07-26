interface IUserRegistrationResponse {
  data: null;
  message: string;
  statusCode: number;
  success: boolean;
}

type TUserAuth = {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  accessToken: string;
};

type IEmailVerifyResponse =
  | {
      success: true;
      message: string;
      statusCode: number;
      accessToken: string;
      data: {
        user: TUserAuth;
      };
    }
  | {
      success: false;
      message: string;
      statusCode: number;
      data: null;
    };

type ILoginUserResponse =
  | {
      success: true;
      message: string;
      statusCode: number;
      accessToken: string;
      data: {
        user: TUserAuth;
      };
    }
  | {
      success: false;
      message: string;
      statusCode: number;
      data: null;
    };

export {
  type IUserRegistrationResponse,
  type IEmailVerifyResponse,
  type ILoginUserResponse,
  type TUserAuth,
};
