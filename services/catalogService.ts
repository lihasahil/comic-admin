import apiClient from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CatalogListItem {
  id: number;
  series_name: string;
  issue_number: string;
  volume: string | null;
  cover_artist: string | null;
  publisher_name: string;
  publication_year: string;
  publication_month: string;
  cover_price: string;
  image_url: string;
  key_issue_status: boolean;
  barcode: string;
  isbn: string | null;
  gcd_issue_id: number;
  is_variant: boolean;
  series_year_began: number;
}

export interface CatalogDetail extends CatalogListItem {
  gcd_series_id: number;
  imprint: string | null;
  printing_edition: string | null;
  variant_of_gcd_id: number | null;
  total_variant_count: number;
  first_appearances: string | null;
  origin_stories: string | null;
  death_return_characters: string | null;
  costume_identity_changes: string | null;
  crossover_events: string | null;
  historic_significance: string | null;
  additional_notes: string | null;
  page_count: number | null;
  cover_artist: string | null;
  cover_description: string | null;
  dimensions: string | null;
  paper_stock: string | null;
  binding_type: string | null;
  cover_type: string | null;
  print_run_numbers: string | null;
  distribution_type: string | null;
  regional_variants: string | null;
  recall_pulped: string | null;
  low_distribution_status: string | null;
  pricecharting_id: string | null;
  pricecharting_product_name: string | null;
  market_price_loose: number | null;
  market_price_complete: number | null;
  market_price_new: number | null;
  market_price_graded: number | null;
  price_grade_40: number | null;
  price_grade_60: number | null;
  price_grade_80: number | null;
  price_grade_92: number | null;
  price_grade_94: number | null;
  price_grade_98: number | null;
  price_grade_100: number | null;
  price_last_updated: string | null;
  pricing_snapshot: PricingSnapshot | null;
  imported_at: string;
  updated_at: string;
}

// ─── Pricing Snapshot ────────────────────────────────────────────────────────

export interface PricingSellRange {
  low: number;
  high: number;
}

export interface PricingGrade {
  grade: string;
  label: string;
  type: "real" | "extrap" | "est" | "highvar";
  raw: { est_value: number; source: string };
  graded: { cgc_value: number; source: string };
  sell_trade: {
    dealer_offer: PricingSellRange;
    bulk_lot: PricingSellRange;
    convention: PricingSellRange;
    store_credit: PricingSellRange;
  };
}

export interface PricingSnapshot {
  loose_price: number;
  updated_at: string;
  total_grades: number;
  grades: PricingGrade[];
}

export interface CatalogSearchResponse {
  total: number;
  offset: number;
  limit: number;
  results: CatalogListItem[];
}

export interface CatalogSearchParams {
  q?: string;
  publisher?: string;
  issue_number?: string;
  year?: string;
  key_issue_only?: boolean;
  limit?: number;
  offset?: number;
}

// ─── Create / Update ─────────────────────────────────────────────────────────

export interface ComicCreatePayload {
  series_name: string;
  issue_number: string;
  volume?: string;
  publisher_name: string;
  publication_year?: string;
  publication_month?: string;
  cover_price?: string;
  barcode?: string;
  isbn?: string;
  series_year_began?: number;
  imprint?: string;
  printing_edition?: string;
  key_issue_status?: boolean;
  first_appearances?: string;
  origin_stories?: string;
  death_return_characters?: string;
  costume_identity_changes?: string;
  crossover_events?: string;
  historic_significance?: string;
  additional_notes?: string;
  page_count?: number;
  cover_artist?: string;
  cover_description?: string;
  dimensions?: string;
  paper_stock?: string;
  binding_type?: string;
  cover_type?: string;
  print_run_numbers?: string;
  distribution_type?: string;
  regional_variants?: string;
  recall_pulped?: string;
  low_distribution_status?: string;
  cover_image?: File;
}

export type ComicUpdatePayload = Partial<
  Omit<ComicCreatePayload, "cover_image"> & {
    image_url?: string;
    market_price_loose?: number;
    market_price_complete?: number;
    market_price_new?: number;
    market_price_graded?: number;
    price_grade_40?: number;
    price_grade_60?: number;
    price_grade_80?: number;
    price_grade_92?: number;
    price_grade_94?: number;
    price_grade_98?: number;
    price_grade_100?: number;
  }
>;

export interface ComicMutationResponse {
  success: boolean;
  comic_id: number;
  comic: CatalogDetail;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const catalogService = {
  search: async (
    params: CatalogSearchParams = {},
  ): Promise<CatalogSearchResponse> => {
    const { limit = 20, offset = 0, key_issue_only = false, ...rest } = params;
    const response = await apiClient.get<CatalogSearchResponse>(
      "/admin/catalog/search",
      { params: { limit, offset, key_issue_only, ...rest } },
    );
    return response.data;
  },

  getComic: async (id: number | string): Promise<CatalogDetail> => {
    const response = await apiClient.get<CatalogDetail>(
      `/admin/catalog/comics/${id}`,
    );
    return response.data;
  },

  createComic: async (
    payload: ComicCreatePayload,
  ): Promise<ComicMutationResponse> => {
    const form = new FormData();
    (Object.keys(payload) as (keyof ComicCreatePayload)[]).forEach((key) => {
      const val = payload[key];
      if (val === undefined || val === null || val === "") return;
      if (key === "cover_image" && val instanceof File) {
        form.append("cover_image", val);
      } else {
        form.append(key, String(val));
      }
    });
    const response = await apiClient.post<ComicMutationResponse>(
      "/admin/catalog/comics",
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  updateComic: async (
    id: number | string,
    payload: ComicUpdatePayload,
  ): Promise<ComicMutationResponse> => {
    const clean: Record<string, unknown> = {};
    (Object.keys(payload) as (keyof ComicUpdatePayload)[]).forEach((key) => {
      const val = payload[key];
      if (val !== undefined) clean[key] = val === "" ? null : val;
    });
    const response = await apiClient.patch<ComicMutationResponse>(
      `/admin/catalog/comics/${id}`,
      clean,
    );
    return response.data;
  },
};
