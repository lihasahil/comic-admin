"use client";

import { useState, useEffect } from "react";
import { X, Check, Loader2, Search } from "lucide-react";
import {
  ScanCollectionCorrection,
  correctionDisputesIdentity,
} from "@/services/scan-collection-correction.service";
import { useReviewScanCollectionCorrection } from "@/hooks/use-scan-collection-correction";
import { CatalogLookup } from "./catalog-lookup";

export function ReviewCorrectionModal({
  correction,
  action,
  onClose,
}: {
  correction: ScanCollectionCorrection | null;
  action: "approve" | "reject" | null;
  onClose: () => void;
}) {
  const [catalogComicId, setCatalogComicId] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [showLookup, setShowLookup] = useState(false);
  const { mutate, isPending, error, reset } =
    useReviewScanCollectionCorrection();

  const open = Boolean(correction && action);
  const isApprove = action === "approve";
  const identityDisputed = correction
    ? correctionDisputesIdentity(correction)
    : false;

  useEffect(() => {
    if (open && correction) {
      // Default to what the system already matched — admin can override
      setCatalogComicId(String(correction.system_found.catalog_comic_id ?? ""));
      setAdminNote("");
      setShowLookup(false);
      reset();
    }
  }, [open, correction, reset]);

  if (!open || !correction || !action) return null;

  const handleSubmit = () => {
    const parsedId = catalogComicId.trim() ? Number(catalogComicId) : undefined;
    mutate(
      {
        correctionId: correction.correction_id,
        payload: {
          action,
          ...(isApprove && parsedId ? { catalog_comic_id: parsedId } : {}),
          ...(adminNote.trim() ? { admin_note: adminNote.trim() } : {}),
        },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-sf-pro bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-lg border border-zinc-800 bg-zinc-950 p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-michroma text-white">
            {isApprove ? "Approve" : "Reject"} Correction
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 mb-4">
          <p className="text-sm text-zinc-400">
            {correction.comic_scan_id} · submitted by{" "}
            {correction.user.full_name}
          </p>

          {isApprove && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-zinc-500 font-sf-pro">
                  Catalog Comic ID
                  {identityDisputed && (
                    <span className="text-amber-400">
                      {" "}
                      — identity was disputed, verify
                    </span>
                  )}
                </label>
                <button
                  type="button"
                  onClick={() => setShowLookup((s) => !s)}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white"
                >
                  <Search size={11} />
                  {showLookup ? "Hide" : "Browse"} catalog
                </button>
              </div>
              <input
                type="number"
                value={catalogComicId}
                onChange={(e) => setCatalogComicId(e.target.value)}
                className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-zinc-600"
                placeholder="e.g. 224451"
              />

              {showLookup && (
                <div className="pt-2">
                  <CatalogLookup
                    correctionId={correction.correction_id}
                    onPick={(id) => {
                      setCatalogComicId(String(id));
                      setShowLookup(false);
                    }}
                  />
                </div>
              )}
            </div>
          )}

          <div>
            <label className="text-xs text-zinc-500 font-sf-pro">
              Admin note (optional, shown to user)
            </label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-zinc-600 resize-none"
              placeholder="Optional note…"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400">
              Something went wrong. Please try again.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-michroma bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-michroma bg-[#C3F001] text-[#171717] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Check size={12} />
            )}
            Confirm {isApprove ? "Approve" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}
