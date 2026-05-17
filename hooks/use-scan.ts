import { scanApi, ScanListParams } from "@/services/scan.service";
import { useQuery } from "@tanstack/react-query";

export const useScans = (params: ScanListParams = {}) => {
  return useQuery({
    queryKey: ["scans", params],
    queryFn: () => scanApi.getScans(params),
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
};
