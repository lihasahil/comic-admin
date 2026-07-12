import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  comicImageService,
  PendingImagesParams,
  ReviewImagePayload,
} from "@/services/comic-image.service";

// Query Keys

export const comicImageKeys = {
  all: ["comic-images"] as const,
  lists: () => [...comicImageKeys.all, "list"] as const,
  list: (params: PendingImagesParams) =>
    [...comicImageKeys.lists(), params] as const,
};

// Hooks

/**
 * Fetch paginated pending (or other status) comic cover images.
 */
export function usePendingComicImages(params: PendingImagesParams = {}) {
  return useQuery({
    queryKey: comicImageKeys.list(params),
    queryFn: () => comicImageService.getPendingImages(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

/**
 * Approve or reject a comic cover image.
 */
export function useReviewComicImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      imageId,
      payload,
    }: {
      imageId: string;
      payload: ReviewImagePayload;
    }) => comicImageService.reviewImage(imageId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: comicImageKeys.lists() });
    },
  });
}
