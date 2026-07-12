"use client";

import { useState, useEffect } from "react";
import { X, ImageOff, Loader2, Sparkles } from "lucide-react";
import { useReviewComicImage } from "@/hooks/use-comic-image";
import { PendingComicImage } from "@/services/comic-image.service";

interface ReviewImageModalProps {
  image: PendingComicImage | null;
  open: boolean;
  onClose: () => void;
  initialDecision?: "approved" | "rejected";
}

export function ReviewImageModal({
  image,
  open,
  onClose,
  initialDecision = "rejected",
}: ReviewImageModalProps) {
  const [decision, setDecision] = useState<"approved" | "rejected">(
    initialDecision,
  );
  const [updateCover, setUpdateCover] = useState(true);
  const [notes, setNotes] = useState("");
  const { mutate, isPending, error, reset } = useReviewComicImage();

  useEffect(() => {
    if (open) {
      setDecision(initialDecision);
      setUpdateCover(true);
      setNotes("");
      reset();
    }
  }, [open, initialDecision, reset]);

  if (!open || !image) return null;

  const needsNotes = decision === "rejected";
  const canSubmit = !needsNotes || notes.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    mutate(
      {
        imageId: image.image_id,
        payload: {
          status: decision,
          update_cover: updateCover,
          ...(notes.trim() ? { notes: notes.trim() } : {}),
        },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-[#171717] p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-base font-michroma text-white">
            Review Cover Image
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Preview */}
        <div className="flex gap-3 mb-5">
          <div className="h-24 w-16 shrink-0 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
            {image.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image.image_url}
                alt={image.comic_title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-700">
                <ImageOff size={18} />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center gap-1">
            <p className="text-sm font-medium font-sf-pro text-zinc-200">
              {image.comic_title}
            </p>
            <p className="text-xs text-zinc-600 font-sf-pro">
              @{image.uploaded_by?.username ?? "unknown"}
            </p>
            {image.qdrant_eligible && (
              <span className="flex items-center gap-1 text-[10px] font-michroma text-[#C3F001]">
                <Sparkles size={10} />
                Visual search eligible
              </span>
            )}
          </div>
        </div>

        {/* Decision */}
        <div className="flex gap-3 mb-5">
          <button
            onClick={() => setDecision("approved")}
            className={`flex-1 rounded-lg py-2.5 text-[13px] font-michroma transition-colors border ${
              decision === "approved"
                ? "bg-[#C3F001] text-[#171717] border-[#C3F001]"
                : "bg-transparent text-zinc-300 border-zinc-700 hover:border-zinc-600"
            }`}
          >
            Approve
          </button>
          <button
            onClick={() => setDecision("rejected")}
            className={`flex-1 rounded-lg py-2.5 text-[13px] font-michroma transition-colors border ${
              decision === "rejected"
                ? "bg-red-600 text-white border-red-600"
                : "bg-transparent text-zinc-300 border-zinc-700 hover:border-zinc-600"
            }`}
          >
            Reject
          </button>
        </div>

        {/* Update cover toggle (only meaningful for approvals) */}
        {decision === "approved" && (
          <button
            type="button"
            role="switch"
            aria-checked={updateCover}
            onClick={() => setUpdateCover((prev) => !prev)}
            className="flex items-center gap-2.5 mb-5"
          >
            <span
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
                updateCover ? "bg-[#C3F001]" : "bg-zinc-700"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                  updateCover ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </span>
            <span className="text-xs font-sf-pro text-zinc-400">
              Set as comic&apos;s cover image
            </span>
          </button>
        )}

        {/* Notes */}
        <label className="block text-xs text-zinc-500 font-sf-pro mb-2">
          Notes{" "}
          {needsNotes ? (
            <span className="text-red-400">(required for rejection)</span>
          ) : (
            <span className="text-zinc-600">(optional)</span>
          )}
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isPending}
          rows={3}
          className="w-full mb-5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white font-sf-pro outline-none focus:border-[#C3F001] disabled:opacity-50 resize-none"
          placeholder={
            needsNotes
              ? "Reason for rejection…"
              : "Optional note for this decision…"
          }
        />

        {error && (
          <p className="text-xs text-red-400 font-sf-pro mb-4">
            Failed to submit review. Please try again.
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 rounded-lg border border-zinc-700 bg-transparent px-4 py-2.5 text-sm font-michroma text-zinc-300 hover:border-zinc-600 hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || !canSubmit}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-michroma transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50 ${
              decision === "approved"
                ? "bg-[#C3F001] text-[#171717]"
                : "bg-red-600 text-white"
            }`}
          >
            {isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : decision === "approved" ? (
              "Approve"
            ) : (
              "Reject"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
