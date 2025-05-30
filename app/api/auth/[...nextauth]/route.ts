import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { queryOne } from "@/lib/db/postgres";

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
  password_hash: string;
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
        const user = await queryOne<User>(
          "SELECT * FROM users WHERE email = $1",
          [credentials.email]
        );

        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Verify password
        const isValid = await compare(credentials.password, user.password_hash);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        // Return user object if credentials are valid
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role,
          image_url: user.image_url,
          password_hash: user.password_hash,
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
