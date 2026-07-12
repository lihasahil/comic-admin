import apiClient from "@/lib/axios";

// Types

export type UserRole = "user" | "admin";

export interface FounderBadge {
  image_url: string;
}

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
  founder_badge: FounderBadge | null;
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

// Founder Badg

export interface AssignFounderBadgeResponse {
  success: boolean;
  user_id: number;
  badge_number: number | null;
}

/**
 * Derive the badge number from the image filename.
 * Returns null if the user has no founder badge.
 */
export function getFounderBadgeNumber(
  user: Pick<User, "founder_badge">,
): number | null {
  const url = user.founder_badge?.image_url;
  if (!url) return null;
  const match = url.match(/(\d+)\.\w+$/);
  return match ? parseInt(match[1], 10) : null;
}

// Service

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

  assignFounderBadge: async (
    userId: number,
    badgeNumber: number | null,
  ): Promise<AssignFounderBadgeResponse> => {
    const response = await apiClient.patch<AssignFounderBadgeResponse>(
      `/admin/users/${userId}/founder-badge`,
      { badge_number: badgeNumber },
    );
    return response.data;
  },
};
