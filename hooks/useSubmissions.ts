import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  submissionService,
  SubmissionListParams,
  ReviewPayload,
  ReviewDefectPayload,
} from "@/services/submissionService";

import { toast } from "sonner";

// Query Keys

export const submissionKeys = {
  all: ["submissions"] as const,

  lists: () => [...submissionKeys.all, "list"] as const,

  list: (params: SubmissionListParams) =>
    [...submissionKeys.lists(), params] as const,

  details: () => [...submissionKeys.all, "detail"] as const,

  detail: (id: string) => [...submissionKeys.details(), id] as const,

  preview: (id: string) => [...submissionKeys.all, "preview", id] as const,
};

// Hooks

export function useSubmissions(params: SubmissionListParams = {}) {
  return useQuery({
    queryKey: submissionKeys.list(params),
    queryFn: () => submissionService.getSubmissions(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function useSubmission(submissionId: string) {
  return useQuery({
    queryKey: submissionKeys.detail(submissionId),
    queryFn: () => submissionService.getSubmission(submissionId),
    staleTime: 60_000,
    enabled: !!submissionId,
  });
}

export function usePreviewBlob(submissionId: string, enabled = false) {
  return useQuery({
    queryKey: submissionKeys.preview(submissionId),
    queryFn: () => submissionService.getPreviewBlob(submissionId),
    enabled: enabled && !!submissionId,
    staleTime: Infinity,
  });
}

export function useReviewSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      payload,
    }: {
      submissionId: string;
      payload: ReviewPayload;
    }) => submissionService.reviewSubmission(submissionId, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: submissionKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: submissionKeys.detail(data.submission_id),
      });

      toast.success(
        data.status === "approved"
          ? "Submission approved."
          : "Submission rejected.",
      );
    },

    onError: () => {
      toast.error("Review failed. Please try again.");
    },
  });
}

export function useReviewDefect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      payload,
    }: {
      submissionId: string;
      payload: ReviewDefectPayload;
    }) => submissionService.reviewDefect(submissionId, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: submissionKeys.detail(data.submission_id),
      });
      queryClient.invalidateQueries({
        queryKey: submissionKeys.lists(),
      });

      toast.success(
        data.defect_status === "approved"
          ? "Defect approved."
          : "Defect rejected.",
      );
    },

    onError: () => {
      toast.error("Defect review failed. Please try again.");
    },
  });
}
