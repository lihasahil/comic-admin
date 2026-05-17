import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService, LoginCredentials } from "@/services/auth.service";
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

export const useLogout = () => {
  const { setAuth } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      authService.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      setAuth({ user: null, token: null, isAuthenticated: false });
      queryClient.clear();
      window.location.href = "/login";
    },
  });
};
