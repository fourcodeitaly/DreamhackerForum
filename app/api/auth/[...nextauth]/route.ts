import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { queryOne } from "@/lib/db/postgres";
import { getUserByEmail, getUserById } from "@/lib/db/users/users-get";
import { authenticateUser } from "@/lib/auth/auth";

// Extend the built-in session types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      role: string;
      image_url: string | null;
    } & DefaultSession["user"];
  }
}

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  role: string;
  image_url: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        // Get user from database
        const user = await authenticateUser(
          credentials.email,
          credentials.password
        );

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const userData = await getUserById(user.id);

        if (!userData) {
          throw new Error("User not found");
        }

        // Return user object if credentials are valid
        return {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          username: userData.username,
          role: userData.role,
          image_url: userData.image_url,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
