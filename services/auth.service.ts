import apiClient from "@/lib/axios";
import Cookies from "js-cookie";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  full_name: string;
}

type RegisterPayload = RegisterCredentials & {
  superadmin_key: string;
};

export interface AuthResponse {
  access_token: string;
  token_type: string;
  admin: {
    user_id: number;
    full_name: string;
    email: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  user_id: number;
  email: string;
}

// ✂️ Removed local apiClient — now using the shared instance from api-client.ts

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/admin/login",
      credentials,
    );
    return response.data;
  },

  register: async (credentials: RegisterCredentials) => {
    const payload: RegisterPayload = {
      ...credentials,
      superadmin_key: process.env.NEXT_PUBLIC_SUPERADMIN_KEY!,
    };

    const response = await apiClient.post<RegisterResponse>(
      "/admin/create",
      payload,
    );
    return response.data;
  },

  logout: () => {
    Cookies.remove("access_token");
    localStorage.removeItem("user");
  },

  saveAuth: (authData: AuthResponse) => {
    Cookies.set("access_token", authData.access_token, {
      expires: 7,
      secure: true,
      sameSite: "strict",
    });
    localStorage.setItem("user", JSON.stringify(authData.admin));
  },

  getStoredAuth: () => {
    const token = Cookies.get("access_token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  },
};
