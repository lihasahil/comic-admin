import { useQuery } from "@tanstack/react-query";
import { statsService } from "@/services/statsService";

export const statsKeys = {
  all: ["stats"] as const,
};

export function useStats() {
  return useQuery({
    queryKey: statsKeys.all,
    queryFn: statsService.getStats,
    staleTime: 60_000,
    refetchInterval: 60_000, // auto-refresh every 60s
  });
}
