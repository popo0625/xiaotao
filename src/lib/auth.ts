import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
          role: user.role,
          creditScore: user.creditScore,
          disclaimerAccepted: user.disclaimerAccepted,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.creditScore = user.creditScore;
        token.disclaimerAccepted = user.disclaimerAccepted;
      }
      if (trigger === "update") {
        // Refresh user data from DB (e.g. disclaimerAccepted, avatar)
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { disclaimerAccepted: true, avatar: true },
        });
        if (dbUser) {
          token.disclaimerAccepted = dbUser.disclaimerAccepted;
          token.picture = dbUser.avatar ?? token.picture;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.creditScore = token.creditScore as number;
        session.user.disclaimerAccepted = token.disclaimerAccepted as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
