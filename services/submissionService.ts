import apiClient from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SubmissionStatus = "pending" | "approved" | "rejected" | "reviewed";
export type DefectSeverity = "negligible" | "minor" | "moderate" | "major";

export interface SubmissionUser {
  user_id: number;
  full_name: string;
  username: string | null;
  email: string;
}

export interface Defect {
  defect_key: string;
  display_name: string;
  category: string;
  x: number; // 0–1 relative position
  y: number;
  severity: DefectSeverity;
}

export interface ComicScan {
  comic_scan_id: string;
  barcode: string | null;
  manual_comic_info: {
    title: string;
    issue_number: string;
    publisher: string;
    year: number;
  };
  combined_grade_value: string;
  combined_grade_label: string;
  overall_condition: string | null;
}

export interface SubmissionImage {
  image_url: string;
  defects: Defect[];
  review: string | null;
}

export interface SubmissionListItem {
  submission_id: string;
  comic_scan_id: string;
  status: SubmissionStatus;
  user: SubmissionUser;
  user_grade_value: number;
  user_grade_label: string;
  ai_grade_value: string;
  ai_grade_label: string;
  defect_count: number;
  front_image_url: string;
  admin_notes: string | null;
  created_at: string;
}

export interface SubmissionDetail {
  submission_id: string;
  status: SubmissionStatus;
  created_at: string;
  updated_at: string;
  images: Record<string, SubmissionImage>;
  user_grade_value: number;
  user_grade_label: string;
  ai_grade_value: string;
  ai_grade_label: string;
  user: SubmissionUser;
  comic_scan: ComicScan;
  admin_notes: string | null;
  reviewed_by: string | null;
}

export interface SubmissionListResponse {
  total: number;
  offset: number;
  limit: number;
  submissions: SubmissionListItem[];
}

export interface ReviewPayload {
  status: "approved" | "rejected";
  admin_notes?: string;
}

export interface ReviewResponse {
  success: boolean;
  submission_id: string;
  status: SubmissionStatus;
  admin_notes: string | null;
}

export interface SubmissionListParams {
  limit?: number;
  offset?: number;
  status?: SubmissionStatus;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const submissionService = {
  /**
   * GET /admin/manual-defect-submissions
   * Paginated list, optionally filtered by status.
   */
  getSubmissions: async (
    params: SubmissionListParams = {}
  ): Promise<SubmissionListResponse> => {
    const { limit = 50, offset = 0, status } = params;
    const response = await apiClient.get<SubmissionListResponse>(
      "/admin/manual-defect-submissions",
      { params: { limit, offset, ...(status ? { status } : {}) } }
    );
    return response.data;
  },

  /**
   * GET /admin/manual-defect-submissions/:id
   * Full submission detail including defects and comic scan info.
   */
  getSubmission: async (submissionId: string): Promise<SubmissionDetail> => {
    const response = await apiClient.get<SubmissionDetail>(
      `/admin/manual-defect-submissions/${submissionId}`
    );
    return response.data;
  },

  /**
   * GET /admin/manual-defect-submissions/:id/preview
   * Returns a preview image (blob URL).
   */
  getPreviewUrl: (submissionId: string): string =>
    `/admin/manual-defect-submissions/${submissionId}/preview`,

  getPreviewBlob: async (submissionId: string): Promise<string> => {
    const response = await apiClient.get(
      `/admin/manual-defect-submissions/${submissionId}/preview`,
      { responseType: "blob" }
    );
    return URL.createObjectURL(response.data);
  },

  /**
   * PATCH /admin/manual-defect-submissions/:id/review
   * Approve or reject a submission with optional admin notes.
   */
  reviewSubmission: async (
    submissionId: string,
    payload: ReviewPayload
  ): Promise<ReviewResponse> => {
    const response = await apiClient.patch<ReviewResponse>(
      `/admin/manual-defect-submissions/${submissionId}/review`,
      payload
    );
    return response.data;
  },
};
