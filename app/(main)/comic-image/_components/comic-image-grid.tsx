"use client";

import { PendingComicImage } from "@/services/comic-image.service";
import { Sparkles, User, ImageOff, Check, X } from "lucide-react";

interface Props {
  images: PendingComicImage[];
  onOpenReview: (image: PendingComicImage) => void;
  onQuickApprove: (image: PendingComicImage) => void;
  processingId: string | null;
}

export default function ComicImageGrid({
  images,
  onOpenReview,
  onQuickApprove,
  processingId,
}: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {images.map((img) => {
        const isProcessing = processingId === img.image_id;
        return (
          <div
            key={img.image_id}
            className="group rounded-xl border border-zinc-800 bg-[#171717] overflow-hidden flex flex-col"
          >
            {/* Thumbnail */}
            <div className="relative aspect-2/3 bg-zinc-900">
              {img.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img.image_url}
                  alt={img.comic_title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-700">
                  <ImageOff size={24} />
                </div>
              )}
              {img.qdrant_eligible && (
                <span
                  title="Approving will update visual search"
                  className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 backdrop-blur px-2 py-1 text-[10px] font-michroma text-[#C3F001]"
                >
                  <Sparkles size={10} />
                  Visual search
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col gap-2 flex-1">
              <p
                className="text-sm font-medium text-zinc-200 font-sf-pro line-clamp-2"
                title={img.comic_title}
              >
                {img.comic_title}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-zinc-600 font-sf-pro">
                <User size={11} />@{img.uploaded_by?.username ?? "unknown"}
              </p>

              <div className="mt-auto flex gap-2 pt-2">
                <button
                  onClick={() => onQuickApprove(img)}
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#C3F001] text-[#171717] font-michroma text-[11px] py-2 transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50"
                >
                  <Check size={12} />
                  Approve
                </button>
                <button
                  onClick={() => onOpenReview(img)}
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-zinc-700 text-zinc-300 font-michroma text-[11px] py-2 transition-colors hover:border-red-500/40 hover:text-red-400 disabled:opacity-50"
                >
                  <X size={12} />
                  Review
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
