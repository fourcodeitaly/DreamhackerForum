"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import type { User } from "@/lib/db/users/users-get";
import { useRouter } from "next/navigation";
import { getUserById } from "@/lib/db/users/users-get";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    username: string;
  }) => Promise<any>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Derived state
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);

        if (session?.user) {
          // Only fetch user data if the session user ID has changed
          if (!user || user.id !== session.user.id) {
            const user = await getUserById(session.user.id);
            setUser(user);
          }
        } else {
          setUser(null);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
        setIsLoading(false);
      }
    };

    initAuth();
  }, [session?.user?.id]); // Only depend on the user ID from session

  const login = async (credentials: { email: string; password: string }) => {
    const result = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    router.refresh();
    return result;
  };

  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    username: string;
  }) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  };

  const logout = async () => {
    await signOut({ redirect: false });
    setUser(null);
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isAuthenticated,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
