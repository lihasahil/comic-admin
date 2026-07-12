"use client";

import { useState, useEffect } from "react";
import { X, Award, Loader2 } from "lucide-react";
import { useAssignFounderBadge } from "@/hooks/useUsers";
import { User, getFounderBadgeNumber } from "@/services/userService";

interface AssignFounderBadgeModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

export function AssignFounderBadgeModal({
  user,
  open,
  onClose,
}: AssignFounderBadgeModalProps) {
  const [badgeNumber, setBadgeNumber] = useState<string>("1");
  const { mutate, isPending, error, reset } = useAssignFounderBadge();

  const currentBadgeNumber = user ? getFounderBadgeNumber(user) : null;

  // Reset local state whenever a different user is opened
  useEffect(() => {
    if (open && user) {
      const num = getFounderBadgeNumber(user);
      setBadgeNumber(num ? String(num) : "1");
      reset();
    }
  }, [open, user, reset]);

  if (!open || !user) return null;

  const hasBadge = currentBadgeNumber != null;

  const handleAssign = () => {
    const parsed = parseInt(badgeNumber, 10);
    if (isNaN(parsed) || parsed < 0) return;
    // 0 means "clear the badge" -> send null
    const payload = parsed === 0 ? null : parsed;
    mutate(
      { userId: user.user_id, badgeNumber: payload },
      { onSuccess: onClose },
    );
  };

  const handleRemove = () => {
    mutate({ userId: user.user_id, badgeNumber: null }, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-[#171717] p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Award size={18} className="text-[#C3F001]" />
            <h2 className="text-base font-michroma text-white">
              Founder Badge
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-zinc-400 font-sf-pro mb-1">
          {user.full_name}
        </p>
        <p className="text-xs text-zinc-600 font-sf-pro mb-5">{user.email}</p>

        {/* Current status */}
        <div className="mb-5 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3">
          <p className="text-xs text-zinc-500 font-sf-pro">
            Current badge:{" "}
            <span className={hasBadge ? "text-[#C3F001]" : "text-zinc-500"}>
              {hasBadge ? `#${currentBadgeNumber}` : "None"}
            </span>
          </p>
        </div>

        {/* Badge number input */}
        <label className="block text-xs text-zinc-500 font-sf-pro mb-2">
          Badge number
        </label>
        <input
          type="number"
          min={0}
          value={badgeNumber}
          onChange={(e) => setBadgeNumber(e.target.value)}
          disabled={isPending}
          className="w-full mb-5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white font-sf-pro outline-none focus:border-[#C3F001] disabled:opacity-50"
          placeholder="1 (0 to remove)"
        />

        {error && (
          <p className="text-xs text-red-400 font-sf-pro mb-4">
            Failed to update badge. Please try again.
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {hasBadge && (
            <button
              onClick={handleRemove}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-red-500/40 text-red-400 font-michroma text-[13px] py-2.5 transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                "Remove"
              )}
            </button>
          )}
          <button
            onClick={handleAssign}
            disabled={isPending || badgeNumber === ""}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#C3F001] text-[#171717] font-michroma text-[13px] py-2.5 transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : hasBadge ? (
              "Update"
            ) : (
              "Assign"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
