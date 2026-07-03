import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  catalogService,
  CatalogSearchParams,
  ComicCreatePayload,
  ComicUpdatePayload,
} from "@/services/catalogService";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

const LIMIT = 20;

export const catalogKeys = {
  all: ["catalog"] as const,
  searches: () => [...catalogKeys.all, "search"] as const,
  search: (params: Omit<CatalogSearchParams, "offset" | "limit">) =>
    [...catalogKeys.searches(), params] as const,
  details: () => [...catalogKeys.all, "detail"] as const,
  detail: (id: number | string) => [...catalogKeys.details(), id] as const,
};

export function useRefreshPricing(id: number | string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => catalogService.refreshPricing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.detail(id) });
    },
  });
}

export function useCatalogComicWithPricingRefresh(id: number | string) {
  const triggeredRef = useRef<string | number | null>(null);
  const [refreshDone, setRefreshDone] = useState(false);
  const [isRefreshingPricing, setIsRefreshingPricing] = useState(true);
  const [pricingRefreshFailed, setPricingRefreshFailed] = useState(false);

  useEffect(() => {
    if (!id || triggeredRef.current === id) return;
    triggeredRef.current = id;

    setRefreshDone(false);
    setIsRefreshingPricing(true);
    setPricingRefreshFailed(false);

    catalogService
      .refreshPricing(id)
      .catch(() => setPricingRefreshFailed(true))
      .finally(() => {
        setIsRefreshingPricing(false);
        setRefreshDone(true);
      });
  }, [id]);

  const comicQuery = useQuery({
    queryKey: catalogKeys.detail(id),
    queryFn: () => catalogService.getComic(id),
    staleTime: 120_000,
    enabled: !!id && refreshDone, // only fetch once refresh has settled
  });

  return {
    ...comicQuery,
    isLoading: isRefreshingPricing || (refreshDone && comicQuery.isLoading),
    isRefreshingPricing,
    pricingRefreshFailed,
  };
}

export function useCatalogSearch(
  params: Omit<CatalogSearchParams, "offset" | "limit">,
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey: catalogKeys.search(params),
    queryFn: ({ pageParam = 0 }) =>
      catalogService.search({ ...params, limit: LIMIT, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
    staleTime: 60_000,
    enabled,
  });
}

export function useCatalogComic(id: number | string) {
  return useQuery({
    queryKey: catalogKeys.detail(id),
    queryFn: () => catalogService.getComic(id),
    staleTime: 120_000,
    enabled: !!id,
  });
}

export function useCreateCatalogComic(onSuccess?: (comicId: number) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ComicCreatePayload) =>
      catalogService.createComic(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.searches() });
      toast.success("Comic created successfully.");
      onSuccess?.(data.comic_id);
    },
    onError: () => {
      toast.error("Failed to create comic. Please try again.");
    },
  });
}

export function useUpdateCatalogComic(
  id: number | string,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ComicUpdatePayload) =>
      catalogService.updateComic(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: catalogKeys.searches() });
      toast.success("Comic updated successfully.");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to update comic. Please try again.");
    },
  });
}

export function useRecalculatePricing(id: number | string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => catalogService.recalculatePricing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.detail(id) });
      toast.success("Pricing recalculated successfully.");
    },
    onError: () => {
      toast.error("Failed to recalculate pricing. Please try again.");
    },
  });
}
