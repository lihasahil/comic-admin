import apiClient from "@/lib/axios";

/* ============================================================
   Types
============================================================ */

export type CorrectionStatus = "pending" | "approved" | "rejected";

export interface CorrectionUser {
  user_id: number;
  full_name: string;
  email: string;
}

export interface SystemFound {
  title: string;
  issue_number: string;
  publisher: string;
  year: string;
  identification_source?: string;
  catalog_comic_id: number;
}

export interface UserSays {
  title: string | null;
  issue_number: string | null;
  publisher: string | null;
  year: string | null;
  barcode: string | null;
  note: string | null;
}

export interface OtherFields {
  was: Record<string, unknown>;
  submitted: Record<string, unknown>;
}

export interface ScanCollectionCorrection {
  correction_id: number;
  comic_scan_id: string;
  scan_collection_id?: string;
  status: CorrectionStatus;
  created_at: string;
  reviewed_at: string | null;
  scan_thumbnail: string;
  user: CorrectionUser;
  system_found: SystemFound;
  user_says: UserSays;
  other_fields: OtherFields;
  admin_catalog_id: number | null;
  admin_note: string | null;
}

export interface ScanCollectionCorrectionListResponse {
  total: number;
  offset: number;
  limit: number;
  items: ScanCollectionCorrection[];
}

export interface ScanCollectionCorrectionListParams {
  status?: CorrectionStatus;
  limit?: number;
  offset?: number;
}

export interface ReviewCorrectionPayload {
  action: "approve" | "reject";
  catalog_comic_id?: number;
  admin_note?: string;
}

export interface AppliedComic {
  catalog_comic_id: number;
  title: string;
  issue_number: string;
  publisher: string;
  year: string;
}

export interface ReviewCorrectionResponse {
  success: boolean;
  correction_id: number;
  status: CorrectionStatus;
  applied_comic?: AppliedComic;
  applied_other_fields?: Record<string, unknown>;
}

export interface CatalogSearchResult {
  id: number;
  series_name: string;
  issue_number: string;
  volume: string;
  publisher_name: string;
  publication_year: string;
  cover_price: string;
  barcode: string | null;
  image_url: string;
  key_issue_status: boolean;
  is_variant: boolean;
  market_price_loose: number;
}

export interface CatalogSearchResponse {
  correction_id: number;
  barcode_matches: CatalogSearchResult[];
  catalog_results: CatalogSearchResult[];
  tip: string;
}

export interface CatalogSearchParams {
  query?: string;
  limit?: number;
}

/**
 * A correction disputes core identity (title/issue/publisher/year)
 * if the user submitted a value for any of those fields.
 * `catalog_comic_id` is required on approve only in that case.
 */
export function correctionDisputesIdentity(
  correction: Pick<ScanCollectionCorrection, "user_says">,
): boolean {
  const { title, issue_number, publisher, year } = correction.user_says;
  return Boolean(title || issue_number || publisher || year);
}

/* ============================================================
   Service
============================================================ */

export const scanCollectionCorrectionService = {
  /**
   * GET /admin/scan-collection-corrections
   */
  getCorrections: async (
    params: ScanCollectionCorrectionListParams = {},
  ): Promise<ScanCollectionCorrectionListResponse> => {
    const { status, limit = 50, offset = 0 } = params;
    const response = await apiClient.get<ScanCollectionCorrectionListResponse>(
      "/admin/scan-collection-corrections",
      {
        params: {
          limit,
          offset,
          ...(status ? { status } : {}),
        },
      },
    );
    return response.data;
  },

  /**
   * PATCH /admin/scan-collection-corrections/{correction_id}
   */
  reviewCorrection: async (
    correctionId: number,
    payload: ReviewCorrectionPayload,
  ): Promise<ReviewCorrectionResponse> => {
    const response = await apiClient.patch<ReviewCorrectionResponse>(
      `/admin/scan-collection-corrections/${correctionId}`,
      payload,
    );
    return response.data;
  },

  /**
   * GET /admin/scan-collection-corrections/{correction_id}/catalog-search
   */

  searchCatalog: async (
    correctionId: number,
    limit = 20,
  ): Promise<CatalogSearchResponse> => {
    const response = await apiClient.get<CatalogSearchResponse>(
      `/admin/scan-collection-corrections/${correctionId}/catalog-search`,
      { params: { limit } },
    );
    return response.data;
  },
};
