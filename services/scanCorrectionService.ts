import apiClient from "@/lib/axios";

// Types 

export type ScanCorrectionStatus = "pending" | "approved" | "rejected";

export interface ScanCorrectionUser {
  user_id: number;
  full_name: string | null;
  email: string | null;
}

export interface ScanCorrectionSystemFound {
  title: string | null;
  issue_number: string | null;
  publisher: string | null;
  year: string | null;
  identification_source: string | null;
  catalog_comic_id: number | null;
}

export interface ScanCorrectionUserSays {
  title: string | null;
  issue_number: string | null;
  publisher: string | null;
  year: string | null;
  barcode: string | null;
  note: string | null;
}

export interface ScanCorrectionListItem {
  correction_id: number;
  comic_scan_id: string;
  status: ScanCorrectionStatus;
  created_at: string | null;
  reviewed_at: string | null;
  scan_thumbnail: string | null;
  user: ScanCorrectionUser;
  system_found: ScanCorrectionSystemFound;
  user_says: ScanCorrectionUserSays;
  admin_catalog_id: number | null;
  admin_note: string | null;
}

export interface ScanCorrectionListResponse {
  total: number;
  offset: number;
  limit: number;
  items: ScanCorrectionListItem[];
}

export interface ScanCorrectionListParams {
  status?: ScanCorrectionStatus;
  limit?: number;
  offset?: number;
}

export interface CatalogMatch {
  id: number;
  series_name: string;
  issue_number: string | null;
  volume: string | null;
  publisher_name: string | null;
  publication_year: string | null;
  cover_price: string | null;
  barcode: string | null;
  image_url: string | null;
  key_issue_status: boolean;
  is_variant: boolean;
  market_price_loose: number | null;
}

export interface ScanCorrectionCatalogSearchResponse {
  correction_id: number;
  barcode_matches: CatalogMatch[];
  catalog_results: CatalogMatch[];
  tip: string;
}

export interface ReviewScanCorrectionPayload {
  action: "approve" | "reject";
  catalog_comic_id: number | null;
  admin_note?: string | null;
}

export interface ReviewScanCorrectionResponse {
  success: boolean;
  correction_id: number;
  status: ScanCorrectionStatus;
  applied_comic?: {
    catalog_comic_id: number;
    title: string;
    issue_number: string | null;
    publisher: string | null;
    year: string | null;
  };
}

// Service

const BASE = "/admin/scan-corrections";

export const scanCorrectionService = {
  /**
   * GET /admin/scan-corrections
   * Paginated list, optionally filtered by status.
   */
  getCorrections: async (
    params: ScanCorrectionListParams = {}
  ): Promise<ScanCorrectionListResponse> => {
    const { limit = 50, offset = 0, status } = params;
    const response = await apiClient.get<ScanCorrectionListResponse>(BASE, {
      params: { limit, offset, ...(status ? { status } : {}) },
    });
    return response.data;
  },

  /**
   * GET /admin/scan-corrections/:id/catalog-search
   * Candidate catalog matches (barcode + text) for a correction.
   */
  getCatalogSearch: async (
    correctionId: number | string,
    limit = 20
  ): Promise<ScanCorrectionCatalogSearchResponse> => {
    const response = await apiClient.get<ScanCorrectionCatalogSearchResponse>(
      `${BASE}/${correctionId}/catalog-search`,
      { params: { limit } }
    );
    return response.data;
  },

  /**
   * PATCH /admin/scan-corrections/:id
   * Approve (with chosen catalog_comic_id) or reject a correction.
   */
  reviewCorrection: async (
    correctionId: number | string,
    payload: ReviewScanCorrectionPayload
  ): Promise<ReviewScanCorrectionResponse> => {
    const response = await apiClient.patch<ReviewScanCorrectionResponse>(
      `${BASE}/${correctionId}`,
      payload
    );
    return response.data;
  },
};
