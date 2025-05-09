"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "@/lib/db/users-get";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import {
  getUserData,
  loginUser,
  registerUser,
  resendConfirmationEmailServer,
  logoutUser,
} from "@/app/actions/auth";

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
  resendConfirmationEmail: (email: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Derived state
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);

        // Check if we have server-rendered auth data
        const authDataScript = document.getElementById("auth-data");
        if (authDataScript) {
          try {
            const serverAuthData = JSON.parse(
              authDataScript.textContent || "{}"
            );
            if (serverAuthData.isAuthenticated) {
              const { user: userData, error } = await getUserData(
                serverAuthData.userId
              );
              if (userData && !error) {
                setUser(userData);
                setIsLoading(false);
                return;
              }
            }
          } catch (e) {
            console.error("Error parsing server auth data:", e);
          }
        }

        // Fall back to client-side auth check
        const supabase = createClientSupabaseClient();
        if (!supabase) {
          console.error("Failed to create Supabase client");
          setUser(null);
          setIsLoading(false);
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { user: userData, error } = await getUserData(user.id);
          if (userData && !error) {
            setUser(userData);
          } else {
            console.warn("User authenticated but no profile found");
            setUser(null);
          }
        } else {
          setUser(null);
        }

        // Set up auth state listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            const { user: userData, error } = await getUserData(
              session.user.id
            );
            if (userData && !error) {
              setUser(userData);
            } else {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        });

        setIsLoading(false);
        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const { user: userData, error } = await loginUser(credentials);
    if (error) throw new Error(error);
    if (userData) setUser(userData);
    return userData;
  };

  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    username: string;
  }) => {
    const { data, error } = await registerUser(userData);
    if (error) throw new Error(error);
    return data;
  };

  const resendConfirmationEmail = async (email: string) => {
    const { error } = await resendConfirmationEmailServer(email);
    if (error) throw new Error(error);
  };

  const logout = async () => {
    const { error } = await logoutUser();
    if (error) throw new Error(error);
    setUser(null);
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
        resendConfirmationEmail,
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
