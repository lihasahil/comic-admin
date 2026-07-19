"use client";

import { X, ImageIcon, AlertTriangle, CheckCircle2 } from "lucide-react";
import { CoverMatchResponse } from "@/services/scan-collection-correction.service";

export default function CoverMatchModal({
  result,
  onClose,
}: {
  result: CoverMatchResponse | null;
  onClose: () => void;
}) {
  if (!result) return null;

  const scorePct = Math.round(result.cover_match_score * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-sf-pro bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-950 p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-michroma text-white flex items-center gap-2">
            <ImageIcon size={16} className="text-zinc-500" />
            Cover Match
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 flex items-center justify-between">
            <span className="text-xs text-zinc-500">Match score</span>
            <span className="text-xl font-michroma text-white">
              {scorePct}%
            </span>
          </div>

          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-michroma ${
              result.cover_match_flag
                ? "bg-amber-500/10 text-amber-400"
                : "bg-green-500/10 text-green-400"
            }`}
          >
            {result.cover_match_flag ? (
              <>
                <AlertTriangle size={13} />
                FLAGGED — possible cover mismatch
              </>
            ) : (
              <>
                <CheckCircle2 size={13} />
                No mismatch flagged
              </>
            )}
          </div>

          <p className="text-[11px] text-zinc-600">
            Correction #{result.correction_id}
          </p>
        </div>

        <div className="flex justify-end mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-michroma bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
