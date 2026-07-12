"use client";

import { useState } from "react";
import {
  usePendingComicImages,
  useReviewComicImage,
  comicImageKeys,
} from "@/hooks/use-comic-image";
import { useQueryClient } from "@tanstack/react-query";

import { RefreshCw, ImageIcon, Loader2 } from "lucide-react";
import { PendingComicImage } from "@/services/comic-image.service";
import ComicImageFilter, {
  StatusFilter,
} from "./_components/comic-image-filter";
import ComicImageGrid from "./_components/comic-image-grid";
import { ReviewImageModal } from "./_components/review-image-modal";

const LIMIT = 20;

export default function ComicImagesPage() {
  const [status, setStatus] = useState<StatusFilter>("pending");
  const [offset, setOffset] = useState(0);
  const [reviewImage, setReviewImage] = useState<PendingComicImage | null>(
    null,
  );
  const [initialDecision, setInitialDecision] = useState<
    "approved" | "rejected"
  >("approved");
  const queryClient = useQueryClient();

  const params = { status, limit: LIMIT, offset };

  const { data, isLoading, isError, isFetching, refetch } =
    usePendingComicImages(params);
  const { mutate: reviewMutate, isPending, variables } = useReviewComicImage();

  const images = data?.images ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);
  const currentPage = Math.floor(offset / LIMIT) + 1;

  const handleStatusChange = (v: StatusFilter) => {
    setStatus(v);
    setOffset(0);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: comicImageKeys.lists() });
  };

  const handleQuickApprove = (image: PendingComicImage) => {
    reviewMutate({
      imageId: image.image_id,
      payload: { status: "approved", update_cover: true },
    });
  };

  const handleOpenReview = (image: PendingComicImage) => {
    setInitialDecision("rejected");
    setReviewImage(image);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold font-michroma tracking-tight text-white">
              Comic Cover Review
            </h1>
            <p className="text-sm font-sf-pro text-zinc-500 mt-1">
              Approve or reject user-uploaded front covers
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="flex items-center justify-center font-michroma w-full md:w-xs bg-[#C3F001] text-[#171717] gap-2 rounded-lg px-5 py-2.5 text-[14px] transition-opacity hover:opacity-90 active:opacity-80"
          >
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <ComicImageFilter
            status={status}
            onStatusChange={handleStatusChange}
          />
          <div className="flex items-center gap-2">
            {isFetching && !isLoading && (
              <span className="flex items-center gap-1.5 text-xs text-zinc-600 font-sf-pro">
                <Loader2 size={11} className="animate-spin" />
                Updating…
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 font-sf-pro">
            <Loader2 size={28} className="animate-spin text-zinc-600" />
            <p className="text-sm text-zinc-600">Loading images…</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 font-sf-pro">
            <ImageIcon size={32} className="text-zinc-700" />
            <p className="text-sm text-zinc-500">Failed to load images.</p>
            <button
              onClick={() => refetch()}
              className="text-xs text-amber-400 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 font-sf-pro">
            <ImageIcon size={32} className="text-zinc-700" />
            <p className="text-sm text-zinc-500">
              No {status} images right now.
            </p>
          </div>
        ) : (
          <ComicImageGrid
            images={images}
            onOpenReview={handleOpenReview}
            onQuickApprove={handleQuickApprove}
            processingId={isPending ? (variables?.imageId ?? null) : null}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-[#888888] font-sf-pro">
              Page {currentPage} of {totalPages} · {total} total
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - LIMIT))}
                className="px-3 py-1.5 rounded-lg text-xs font-michroma bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setOffset(offset + LIMIT)}
                className="px-3 py-1.5 rounded-lg text-xs bg-zinc-900 font-michroma border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ReviewImageModal
        image={reviewImage}
        open={!!reviewImage}
        onClose={() => setReviewImage(null)}
        initialDecision={initialDecision}
      />
    </div>
  );
}
