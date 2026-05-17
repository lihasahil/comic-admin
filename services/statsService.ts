import apiClient from "@/lib/axios";

export interface AdminStats {
  users: {
    total: number;
    active: number;
    onboarded: number;
  };
  scans: {
    total: number;
    done: number;
    failed: number;
  };
  feedback: {
    pending: number;
    approved: number;
    rejected: number;
  };
  coins: {
    total_in_circulation: number;
  };
  manual_submissions: {
    pending: number;
    reviewed: number;
  };
}

export const statsService = {
  getStats: async (): Promise<AdminStats> => {
    const response = await apiClient.get<AdminStats>("/admin/stats");
    return response.data;
  },
};
