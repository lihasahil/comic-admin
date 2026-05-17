import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  authService,
  LoginCredentials,
  RegisterCredentials,
} from "@/services/auth.service";
import { useAuth } from "@/contexts/auth-context";

export const useLogin = () => {
  const router = useRouter();
  const { setAuth } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      authService.saveAuth(data);
      setAuth({
        user: data.admin,
        token: data.access_token,
        isAuthenticated: true,
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/dashboard");
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
      throw error;
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authService.register(credentials),
    onSuccess: (data) => {
      console.log("Registration successful:", data);
      router.push("/login?registered=true");
    },
    onError: (error: any) => {
      console.error("Registration failed:", error);
      throw error;
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const { setAuth } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      authService.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      setAuth({
        user: null,
        token: null,
        isAuthenticated: false,
      });
      queryClient.clear();
      router.push("/login");
    },
  });
};
