import apiClient from "@/lib/axios";

// Types

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface UploadedBy {
  user_id?: number;
  username: string;
}

export interface PendingComicImage {
  image_id: string;
  image_url: string;
  comic_title: string;
  uploaded_by: UploadedBy;
  qdrant_eligible: boolean;
  status?: ReviewStatus;
  created_at?: string;
}

export interface PendingImagesResponse {
  total: number;
  offset: number;
  limit: number;
  images: PendingComicImage[];
}

export interface PendingImagesParams {
  status?: ReviewStatus;
  limit?: number;
  offset?: number;
}

export interface ReviewImagePayload {
  status: "approved" | "rejected";
  update_cover: boolean;
  notes?: string;
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
