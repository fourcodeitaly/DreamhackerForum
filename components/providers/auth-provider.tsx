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
  const [authState, setAuthState] = useState<{
    user: User | null;
    isLoading: boolean;
  }>({
    user: null,
    isLoading: true,
  });
  const router = useRouter();

  // Derived state
  const isAuthenticated = !!authState.user;
  const isAdmin = authState.user?.role === "admin";

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Only fetch user data if the session user ID has changed
        if (
          session?.user &&
          (!authState.user || authState.user.id !== session.user.id)
        ) {
          const response = await fetch(`/api/auth/users`);

          if (!response.ok) {
            throw new Error("Failed to fetch user");
          }

          const user = (await response.json()) as User;
          setAuthState({ user, isLoading: false });
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setAuthState({ user: null, isLoading: false });
      }
    };

    initAuth();
  }, [session?.user?.id]);

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
    setAuthState({ user: null, isLoading: false });
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isAdmin,
        isAuthenticated,
        login,
        register,
        logout,
        isLoading: authState.isLoading,
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
