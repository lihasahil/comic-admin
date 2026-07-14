"use client";

import { useEffect, useState } from "react";
import { useReviewDefect } from "@/hooks/useSubmissions";
import { Defect } from "@/services/submissionService";
import { Check, X, Loader2, MousePointerClick } from "lucide-react";

interface SelectedDefect {
  imageKey: string;
  defect: Defect;
}

interface Props {
  submissionId: string;
  defectsTotal: number;
  defectsReviewed: number;
  selectedDefect: SelectedDefect | null;
  onClearSelection: () => void;
}

export default function ReviewPanel({
  submissionId,
  defectsTotal,
  defectsReviewed,
  selectedDefect,
  onClearSelection,
}: Props) {
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(
    null,
  );
  const [notes, setNotes] = useState("");
  const { mutate, isPending } = useReviewDefect();

  // Reset the form whenever a different defect is selected
  useEffect(() => {
    if (selectedDefect) {
      setDecision(selectedDefect.defect.review?.status ?? null);
      setNotes(selectedDefect.defect.review?.notes ?? "");
    } else {
      setDecision(null);
      setNotes("");
    }
  }, [selectedDefect?.imageKey, selectedDefect?.defect.defect_index]);

  // Nothing selected — show progress summary
  if (!selectedDefect) {
    return (
      <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
        <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium mb-4">
          Review
        </p>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] p-3 text-center">
            <div className="text-2xl font-bold font-michroma tabular-nums text-white">
              {defectsTotal}
            </div>
            <div className="text-[10px] text-[#888888] font-sf-pro uppercase tracking-wider mt-1">
              Total defects
            </div>
          </div>
          <div className="flex-1 rounded-lg bg-[#C3F0011A] border border-[#C3F0014D] p-3 text-center">
            <div className="text-2xl font-bold font-michroma tabular-nums text-primary">
              {defectsReviewed}
            </div>
            <div className="text-[10px] text-[#888888] font-sf-pro uppercase tracking-wider mt-1">
              Reviewed
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-[11px] font-sf-pro text-zinc-500 bg-zinc-900/60 border border-zinc-800 rounded-lg p-3 leading-relaxed">
          <MousePointerClick
            size={13}
            className="shrink-0 mt-0.5 text-zinc-600"
          />
          <span>
            Click a defect on the map or in the list, then hit{" "}
            <span className="text-zinc-300 font-medium">Review</span> to approve
            or reject it.
          </span>
        </div>
      </div>
    );
  }

  const { imageKey, defect } = selectedDefect;
  const alreadyReviewed = !!defect.review;

  const handleSubmit = () => {
    if (!decision) return;
    mutate(
      {
        submissionId,
        payload: {
          image_key: imageKey,
          defect_index: defect.defect_index,
          status: decision,
          notes: notes || undefined,
        },
      },
      { onSuccess: onClearSelection },
    );
  };

  return (
    <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium">
          Review defect
        </p>
        <button
          onClick={onClearSelection}
          className="text-[10px] text-zinc-600 hover:text-zinc-400 font-sf-pro"
        >
          Cancel
        </button>
      </div>

      <div>
        <div className="text-sm font-medium font-sf-pro text-zinc-200">
          {defect.display_name}
        </div>
        <div className="text-[10px] text-zinc-600 font-sf-pro mt-0.5 uppercase tracking-wider">
          {defect.category}
        </div>
      </div>

      {alreadyReviewed && (
        <div className="text-[10px] font-sf-pro text-zinc-500 bg-zinc-900/60 border border-zinc-800 rounded-lg px-3 py-2">
          Previously {defect.review!.status}
          {defect.review!.notes ? ` — "${defect.review!.notes}"` : ""}
        </div>
      )}

      {/* Decision buttons */}
      <div className="flex gap-2">
        <button
          onClick={() =>
            setDecision(decision === "approved" ? null : "approved")
          }
          className={`flex-1 flex items-center cursor-pointer justify-center gap-1.5 font-sf-pro py-2 rounded-lg text-xs font-medium border transition-all ${
            decision === "approved"
              ? "bg-primary/20 text-primary border-primary"
              : "bg-transparent text-[#888888] border-[#888888] hover:text-primary hover:border-primary/30"
          }`}
        >
          <Check size={12} /> Approve
        </button>
        <button
          onClick={() =>
            setDecision(decision === "rejected" ? null : "rejected")
          }
          className={`flex-1 flex items-center cursor-pointer justify-center gap-1.5 font-sf-pro py-2 rounded-lg text-xs font-medium border transition-all ${
            decision === "rejected"
              ? "bg-red-500/20 text-red-400 border-red-500/40"
              : "bg-transparent text-[#888888] border-[#888888] hover:text-red-400 hover:border-red-500/30"
          }`}
        >
          <X size={12} /> Reject
        </button>
      </div>

      {/* Notes */}
      <div>
        <label className="text-xs font-sf-pro text-zinc-600 block mb-1.5">
          Notes <span className="text-zinc-700">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Add notes for this defect…"
          className="w-full px-3 py-2 text-xs rounded-lg font-sf-pro bg-zinc-800 border border-zinc-700 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 resize-none transition-colors"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!decision || isPending}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold bg-primary font-michroma text-zinc-900 hover:bg-primary/90 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {isPending ? (
          <>
            <Loader2 size={12} className="animate-spin" /> Submitting…
          </>
        ) : (
          <>Submit review</>
        )}
      </button>
    </div>
  );
}
