"use client";

import { useState } from "react";
import { useReviewScanCorrection } from "@/hooks/useScanCorrections";
import { ScanCorrectionStatus } from "@/services/scanCorrectionService";
import { Check, X, Loader2 } from "lucide-react";

interface Props {
  correctionId: string;
  currentStatus: ScanCorrectionStatus;
  currentNote: string | null;
  selectedCatalogId: number | null;
}

export default function ReviewPanel({
  correctionId,
  currentStatus,
  currentNote,
  selectedCatalogId,
}: Props) {
  const [note, setNote] = useState(currentNote ?? "");
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const { mutate, isPending } = useReviewScanCorrection();

  const isPendingStatus = currentStatus === "pending";
  const canSubmit =
    decision === "reject" || (decision === "approve" && !!selectedCatalogId);

  const handleSubmit = () => {
    if (!decision || !canSubmit) return;
    mutate({
      correctionId,
      payload: {
        action: decision,
        catalog_comic_id: decision === "approve" ? selectedCatalogId : null,
        admin_note: note || undefined,
      },
    });
  };

  if (!isPendingStatus) {
    return (
      <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
        <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium mb-3">
          Review
        </p>
        <div
          className={`flex items-center gap-2 font-sf-pro text-sm font-medium ${
            currentStatus === "approved" ? "text-primary" : "text-red-600"
          }`}
        >
          {currentStatus === "approved" ? <Check size={14} /> : <X size={14} />}
          {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
        </div>
        {currentNote && (
          <p className="text-xs font-sf-pro text-[#888888] mt-2 leading-relaxed">
            Notes: {currentNote}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4 space-y-4">
      <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium">
        Review decision
      </p>

      {/* Decision buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setDecision(decision === "approve" ? null : "approve")}
          className={`flex-1 flex items-center cursor-pointer justify-center gap-1.5 font-sf-pro py-2 rounded-lg text-xs font-medium border transition-all ${
            decision === "approve"
              ? "bg-primary/20 text-primary border-primary"
              : "bg-transparent text-[#888888] border-[#888888] hover:text-primary hover:border-primary/30"
          }`}
        >
          <Check size={12} /> Approve
        </button>
        <button
          onClick={() => setDecision(decision === "reject" ? null : "reject")}
          className={`flex-1 flex items-center cursor-pointer justify-center gap-1.5 font-sf-pro py-2 rounded-lg text-xs font-medium border transition-all ${
            decision === "reject"
              ? "bg-red-500/20 text-red-400 border-red-500/40"
              : "bg-transparent text-[#888888] border-[#888888] hover:text-red-400 hover:border-red-500/30"
          }`}
        >
          <X size={12} /> Reject
        </button>
      </div>

      {decision === "approve" && !selectedCatalogId && (
        <p className="text-[11px] font-sf-pro text-amber-400">
          Select a catalog match below before approving.
        </p>
      )}

      {/* Notes */}
      <div>
        <label className="text-xs font-sf-pro text-zinc-600 block mb-1.5">
          Admin note <span className="text-zinc-700">(optional)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Add a note for this decision…"
          className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 resize-none transition-colors"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!decision || !canSubmit || isPending}
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
