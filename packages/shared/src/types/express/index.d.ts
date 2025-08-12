import { JwtPayload } from "jsonwebtoken";

// @types/express/index.d.ts
declare global {
  namespace Express {
    interface Request {
      user: {
        _id: string;
        email: string;
        username: string;
      };
    }
  }
}

export {};
