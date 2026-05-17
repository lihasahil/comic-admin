"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService } from "@/services/auth.service";

interface User {
  user_id: number;
  full_name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  setAuth: (auth: AuthState) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const { token, user } = authService.getStoredAuth();
    if (token && user) {
      setAuthState({
        user,
        token,
        isAuthenticated: true,
      });
    }
    setLoading(false);
  }, []);

  const setAuth = (auth: AuthState) => {
    setAuthState(auth);
  };

  return (
    <AuthContext.Provider value={{ ...authState, setAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
