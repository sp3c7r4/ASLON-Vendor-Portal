import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { mockStore } from "./mock-data";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || "aslon-vendor-portal-secret-key-for-development",
  trustHost: true, // Required for production deployments
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = mockStore.users.findByEmail(credentials.email as string);
        if (!user || user.password !== credentials.password) {
          return null;
        }

        if (user.status === "suspended") {
          throw new Error("Account is suspended");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        // @ts-ignore
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
});

