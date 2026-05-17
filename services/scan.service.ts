import apiClient from "@/lib/axios";

export type ScanStatus = "done" | "processing" | "failed";

export interface Scan {
  scan_id: string;
  user_id: number;
  username: string;
  status: ScanStatus;
  ai_grade: string;
  comic_id: string;
  gcd_match_id: string;
  defect_count: number;
  coins_used: number;
  thumbnail: string;
  created_at: string;
}

export interface ScanListResponse {
  total: number;
  offset: number;
  limit: number;
  scans: Scan[];
}

export interface ScanListParams {
  status?: ScanStatus;
  limit?: number;
  offset?: number;
}

export const scanApi = {
  getScans: async (params: ScanListParams = {}): Promise<ScanListResponse> => {
    const { status, limit = 50, offset = 0 } = params;

    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (status) {
      queryParams.append("status", status);
    }

    const response = await apiClient.get<ScanListResponse>(
      `/admin/scans?${queryParams.toString()}`,
    );

    return response.data;
  },
};
