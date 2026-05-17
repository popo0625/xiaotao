import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      creditScore: number;
      disclaimerAccepted: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    creditScore: number;
    disclaimerAccepted: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    creditScore: number;
    disclaimerAccepted: boolean;
  }
}
