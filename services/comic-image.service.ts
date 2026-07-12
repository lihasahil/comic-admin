import apiClient from "@/lib/axios";

// Types

export type ReviewStatus = "pending" | "approved" | "rejected";

export type ImageType = "front" | "back" | "spine" | string;

export interface UploadedBy {
  user_id: number;
  username: string;
  full_name?: string | null;
}

export interface PendingComicImage {
  image_id: string;
  comic_id: string;
  comic_title: string;
  comic_gcd_issue_id?: number | null;
  image_url: string;
  image_type: ImageType;
  approval_status: ReviewStatus;
  qdrant_indexed: boolean;
  qdrant_eligible: boolean;
  uploaded_by: UploadedBy;
  created_at: string;
  reviewed_at?: string | null;
}

export interface PendingImagesResponse {
  success: boolean;
  total: number;
  limit: number;
  offset: number;
  images: PendingComicImage[];
}

export interface PendingImagesParams {
  status?: ReviewStatus;
  limit?: number;
  offset?: number;
}

export interface ReviewImagePayload {
  status: "approved" | "rejected";
  notes?: string;
  update_cover: boolean;
}

export interface ReviewImageResponse {
  success: boolean;
  image_id: string;
  status: ReviewStatus;
  update_cover: boolean;
  qdrant_updated?: boolean;
}

// Service

export const comicImageService = {
  /**
   * GET /api/admin/comic-images/pending
   * Fetch paginated list of user-uploaded front covers awaiting review.
   */
  getPendingImages: async (
    params: PendingImagesParams = {},
  ): Promise<PendingImagesResponse> => {
    const { status = "pending", limit = 20, offset = 0 } = params;
    const response = await apiClient.get<PendingImagesResponse>(
      "/admin/comic-images/pending",
      { params: { status, limit, offset } },
    );
    return response.data;
  },

  /**
   * PATCH /api/admin/comic-images/{image_id}/review
   * Approve or reject a pending cover image.
   */
  reviewImage: async (
    imageId: string,
    payload: ReviewImagePayload,
  ): Promise<ReviewImageResponse> => {
    const response = await apiClient.patch<ReviewImageResponse>(
      `/admin/comic-images/${imageId}/review`,
      payload,
    );
    return response.data;
  },
};
