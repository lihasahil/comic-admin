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
} from "@/services/scan-collection-correction.service";

/* ============================================================
   Query Keys
============================================================ */

export const scanCollectionCorrectionKeys = {
  all: ["scan-collection-corrections"] as const,
  lists: () => [...scanCollectionCorrectionKeys.all, "list"] as const,
  list: (params: ScanCollectionCorrectionListParams) =>
    [...scanCollectionCorrectionKeys.lists(), params] as const,
  details: () => [...scanCollectionCorrectionKeys.all, "detail"] as const,
  detail: (correctionId: number) =>
    [...scanCollectionCorrectionKeys.details(), correctionId] as const,
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
 * Fetch paginated list of scan collection corrections (summary rows).
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
 * Fetch the full record for a single correction (detail page).
 */
export function useScanCollectionCorrectionDetail(correctionId: number | null) {
  return useQuery({
    queryKey: scanCollectionCorrectionKeys.detail(correctionId ?? -1),
    queryFn: () =>
      scanCollectionCorrectionService.getCorrectionDetail(
        correctionId as number,
      ),
    enabled: correctionId !== null && !Number.isNaN(correctionId),
    staleTime: 15_000,
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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: scanCollectionCorrectionKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: scanCollectionCorrectionKeys.detail(variables.correctionId),
      });
    },
  });
}

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

/**
 * Triggers a cover-match check for a correction on demand (button click),
 * rather than fetching automatically — hence a mutation, not a query.
 */
export function useCorrectionCoverMatch() {
  return useMutation({
    mutationFn: (correctionId: number) =>
      scanCollectionCorrectionService.getCoverMatch(correctionId),
  });
}
