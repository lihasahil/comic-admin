import apiClient from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FeedbackImage {
  image_id: string;
  image_url: string;
}

export interface FeedbackUser {
  user_id: number | null;
  full_name: string | null;
  username: string | null;
  email: string | null;
}

export type FeedbackStatus = "pending" | "approved" | "rejected";

export interface Feedback {
  feedback_id: string;
  title: string | null;
  status: FeedbackStatus;
  feedback_type: string | null;
  content: string;
  coins_rewarded: number;
  admin_notes: string | null;
  created_at: string;
  images: FeedbackImage[];
  image_count: number;
  user: FeedbackUser;
  scan: unknown;
}

export interface FeedbackListResponse {
  total: number;
  offset: number;
  limit: number;
  feedbacks: Feedback[];
}

export interface ApproveRejectResponse {
  success: boolean;
  feedback_id: string;
  status: FeedbackStatus;
  coins_awarded?: number;
  user_new_balance?: number;
}

export interface FeedbackListParams {
  limit?: number;
  offset?: number;
  status?: FeedbackStatus;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const feedbackService = {
  /**
   * GET /admin/feedback
   * Fetch paginated list of all feedback submissions.
   */
  getFeedbacks: async (
    params: FeedbackListParams = {}
  ): Promise<FeedbackListResponse> => {
    const { limit = 50, offset = 0, status } = params;
    const response = await apiClient.get<FeedbackListResponse>(
      "/admin/feedback",
      {
        params: {
          limit,
          offset,
          ...(status ? { status } : {}),
        },
      }
    );
    return response.data;
  },

  /**
   * POST /admin/feedback/:feedback_id/approve
   * Approve a feedback and award coins to the user.
   */
  approveFeedback: async (
    feedbackId: string
  ): Promise<ApproveRejectResponse> => {
    const response = await apiClient.post<ApproveRejectResponse>(
      `/admin/feedback/${feedbackId}/approve`,
      {}
    );
    return response.data;
  },

  /**
   * POST /admin/feedback/:feedback_id/reject
   * Reject a feedback submission.
   */
  rejectFeedback: async (
    feedbackId: string
  ): Promise<ApproveRejectResponse> => {
    const response = await apiClient.post<ApproveRejectResponse>(
      `/admin/feedback/${feedbackId}/reject`,
      {}
    );
    return response.data;
  },
};
