import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  scanCollectionCorrectionService,
  ScanCollectionCorrectionListParams,
  ReviewCorrectionPayload,
  CatalogSearchParams,
} from "@/services/scan-collection-correction.service";

/* ============================================================
   Query Keys
============================================================ */

export const scanCollectionCorrectionKeys = {
  all: ["scan-collection-corrections"] as const,
  lists: () => [...scanCollectionCorrectionKeys.all, "list"] as const,
  list: (params: ScanCollectionCorrectionListParams) =>
    [...scanCollectionCorrectionKeys.lists(), params] as const,
  catalogSearch: (correctionId: number) =>
    [
      ...scanCollectionCorrectionKeys.all,
      "catalog-search",
      correctionId,
    ] as const,
};

/* ============================================================
   Hooks
============================================================ */

/**
 * Fetch paginated list of scan collection corrections.
 */
export function useScanCollectionCorrections(
  params: ScanCollectionCorrectionListParams = {},
) {
  return useQuery({
    queryKey: scanCollectionCorrectionKeys.list(params),
    queryFn: () => scanCollectionCorrectionService.getCorrections(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

/**
 * Approve or reject a scan collection correction.
 */
export function useReviewScanCollectionCorrection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      correctionId,
      payload,
    }: {
      correctionId: number;
      payload: ReviewCorrectionPayload;
    }) =>
      scanCollectionCorrectionService.reviewCorrection(correctionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scanCollectionCorrectionKeys.lists(),
      });
    },
  });
}

/**
 * Search the catalog for a possible match on a given correction.
 * Runs with no query on mount (returns barcode_matches + suggestions),
 * and refetches as the admin types a search query.
 */
// src/hooks/useScanCollectionCorrections.ts

/**
 * Fetch catalog matches for a correction. correction_id alone scopes
 * the search on the backend — no query input needed from the admin.
 */
export function useCorrectionCatalogSearch(correctionId: number | null) {
  return useQuery({
    queryKey: scanCollectionCorrectionKeys.catalogSearch(correctionId ?? -1),
    queryFn: () =>
      scanCollectionCorrectionService.searchCatalog(correctionId as number),
    enabled: correctionId !== null,
    staleTime: 15_000,
  });
}
