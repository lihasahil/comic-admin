import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  betaChecklistService,
  BetaTesterListParams,
} from "@/services/beta-checklist.service";

// Query Keys

export const betaTesterKeys = {
  all: ["beta-testers"] as const,
  lists: () => [...betaTesterKeys.all, "list"] as const,
  list: (params: BetaTesterListParams) =>
    [...betaTesterKeys.lists(), params] as const,
};

// Hooks

/**
 * Fetch paginated list of confirmed beta testers.
 */
export function useBetaTesters(params: BetaTesterListParams = {}) {
  return useQuery({
    queryKey: betaTesterKeys.list(params),
    queryFn: () => betaChecklistService.getTesters(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
