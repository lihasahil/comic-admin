import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  scanCorrectionService,
  ScanCorrectionListParams,
  ScanCorrectionListResponse,
  ReviewScanCorrectionPayload,
} from "@/services/scanCorrectionService";
import { AxiosError } from "axios";
import { toast } from "sonner";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const scanCorrectionKeys = {
  all: ["scan-corrections"] as const,

  lists: () => [...scanCorrectionKeys.all, "list"] as const,

  list: (params: ScanCorrectionListParams) =>
    [...scanCorrectionKeys.lists(), params] as const,

  details: () => [...scanCorrectionKeys.all, "detail"] as const,

  detail: (id: string) => [...scanCorrectionKeys.details(), id] as const,

  catalogSearch: (id: string, limit: number) =>
    [...scanCorrectionKeys.all, "catalog-search", id, limit] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useScanCorrections(params: ScanCorrectionListParams = {}) {
  return useQuery({
    queryKey: scanCorrectionKeys.list(params),
    queryFn: () => scanCorrectionService.getCorrections(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

// There is no GET-by-id endpoint for a single correction, so the detail page
// first looks for the item in an already-fetched list page, and only falls
// back to a fresh (large) list fetch on a direct visit / refresh.
export function useScanCorrectionDetail(correctionId: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: scanCorrectionKeys.detail(correctionId),
    queryFn: async () => {
      const cachedLists = queryClient.getQueriesData<ScanCorrectionListResponse>({
        queryKey: scanCorrectionKeys.lists(),
      });
      for (const [, data] of cachedLists) {
        const found = data?.items.find(
          (item) => String(item.correction_id) === correctionId,
        );
        if (found) return found;
      }

      const response = await scanCorrectionService.getCorrections({
        limit: 200,
        offset: 0,
      });
      const found = response.items.find(
        (item) => String(item.correction_id) === correctionId,
      );
      if (!found) throw new Error("Correction not found");
      return found;
    },
    staleTime: 30_000,
    enabled: !!correctionId,
  });
}

export function useScanCorrectionCatalogSearch(
  correctionId: string,
  limit = 20,
) {
  return useQuery({
    queryKey: scanCorrectionKeys.catalogSearch(correctionId, limit),
    queryFn: () =>
      scanCorrectionService.getCatalogSearch(correctionId, limit),
    enabled: !!correctionId,
    staleTime: 60_000,
  });
}

export function useReviewScanCorrection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      correctionId,
      payload,
    }: {
      correctionId: string;
      payload: ReviewScanCorrectionPayload;
    }) => scanCorrectionService.reviewCorrection(correctionId, payload),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: scanCorrectionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: scanCorrectionKeys.detail(variables.correctionId),
      });

      toast.success(
        data.status === "approved"
          ? "Correction approved."
          : "Correction rejected.",
      );
    },

    onError: (error: AxiosError<{ detail?: string }>) => {
      toast.error(
        error.response?.data?.detail ?? "Review failed. Please try again.",
      );
    },
  });
}
