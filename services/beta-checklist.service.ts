import apiClient from "@/lib/axios";

// Types

export interface BetaTester {
  user_id: number;
  email: string;
  full_name: string;
  confirmed_at: string;
}

export interface BetaTesterListResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  testers: BetaTester[];
}

export interface BetaTesterListParams {
  page?: number;
  limit?: number;
}

// Service

export const betaChecklistService = {
  /**
   * GET /admin/beta-checklist/testers
   * Fetch paginated list of confirmed beta testers.
   */
  getTesters: async (
    params: BetaTesterListParams = {},
  ): Promise<BetaTesterListResponse> => {
    const { page = 1, limit = 20 } = params;
    const response = await apiClient.get<BetaTesterListResponse>(
      "/admin/beta-checklist/testers",
      {
        params: { page, limit },
      },
    );
    return response.data;
  },
};
