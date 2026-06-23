import apiClient from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "user" | "admin";

export interface User {
  user_id: number;
  full_name: string;
  username: string | null;
  email: string;
  role: UserRole;
  coins: number;
  is_active: boolean;
  onboarding_complete: boolean;
  scan_count: number;
  collection_size: number;
  approved_feedback_count: number;
  created_at: string;
}

export interface UserListResponse {
  total: number;
  offset: number;
  limit: number;
  users: User[];
}

export interface UserListParams {
  limit?: number;
  offset?: number;
  role?: UserRole;
  is_active?: boolean;
  show_deleted?: boolean;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
  deleted_user_id: number;
  anon_id: string;
  firebase_deleted: boolean;
  deleted_by_admin: number;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const userService = {
  /**
   * GET /admin/users
   * Fetch paginated list of all users.
   */
  getUsers: async (params: UserListParams = {}): Promise<UserListResponse> => {
    const { limit = 50, offset = 0, role, is_active, show_deleted } = params;
    const response = await apiClient.get<UserListResponse>("/admin/users", {
      params: {
        limit,
        offset,
        ...(role ? { role } : {}),
        ...(is_active !== undefined ? { is_active } : {}),
        ...(show_deleted !== undefined ? { show_deleted } : {}),
      },
    });
    return response.data;
  },

  deleteUser: async (userId: number): Promise<DeleteUserResponse> => {
    const response = await apiClient.delete<DeleteUserResponse>(
      `/admin/users/${userId}`,
      { data: {} },
    );
    return response.data;
  },
};
