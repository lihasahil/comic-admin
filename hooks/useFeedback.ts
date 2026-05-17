import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  feedbackService,
  FeedbackListParams,
  FeedbackStatus,
} from "@/services/feedbackService";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const feedbackKeys = {
  all: ["feedbacks"] as const,
  lists: () => [...feedbackKeys.all, "list"] as const,
  list: (params: FeedbackListParams) =>
    [...feedbackKeys.lists(), params] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Fetch paginated feedback list.
 */
export function useFeedbacks(params: FeedbackListParams = {}) {
  return useQuery({
    queryKey: feedbackKeys.list(params),
    queryFn: () => feedbackService.getFeedbacks(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

/**
 * Approve a feedback entry.
 */
export function useApproveFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (feedbackId: string) =>
      feedbackService.approveFeedback(feedbackId),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: feedbackKeys.lists(),
      });

      toast.success("Feedback approved", {
        description: data.coins_awarded
          ? `+${data.coins_awarded} coins awarded`
          : undefined,
      });
    },

    onError: () => {
      toast.error("Failed to approve feedback", {
        description: "Please try again.",
      });
    },
  });
}

/**
 * Reject a feedback entry.
 */
export function useRejectFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (feedbackId: string) =>
      feedbackService.rejectFeedback(feedbackId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: feedbackKeys.lists(),
      });

      toast.success("Feedback rejected");
    },

    onError: () => {
      toast.error("Failed to reject feedback", {
        description: "Please try again.",
      });
    },
  });
}

/**
 * Combined hook — approve + reject with loading state per feedback id.
 */
export function useFeedbackActions(feedbackId: string) {
  const approve = useApproveFeedback();
  const reject = useRejectFeedback();

  const isLoading =
    (approve.isPending && approve.variables === feedbackId) ||
    (reject.isPending && reject.variables === feedbackId);

  return {
    approve: () => approve.mutate(feedbackId),
    reject: () => reject.mutate(feedbackId),

    isLoading,

    isApproving: approve.isPending && approve.variables === feedbackId,

    isRejecting: reject.isPending && reject.variables === feedbackId,
  };
}

export type { FeedbackStatus };
