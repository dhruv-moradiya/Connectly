interface ICommon {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface IUserSchema {
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type { ICommon, IUserSchema };
