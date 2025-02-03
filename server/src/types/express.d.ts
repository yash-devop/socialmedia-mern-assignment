import { Types } from "mongoose";
export {};

declare global {
  namespace Express {
    interface User {
      _id: Types.ObjectId,
      name: string
      email: string;
      profilePicture?: string | null | undefined
    }
  }
}