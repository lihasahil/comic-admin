"use client";

import { ReviewStatus } from "@/services/comic-image.service";

export type StatusFilter = ReviewStatus;

interface Props {
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
}

const OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function ComicImageFilter({ status, onStatusChange }: Props) {
  return (
    <div className="flex items-center bg-[#111111B2] border border-[#FFFFFF33] rounded-lg p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onStatusChange(opt.value)}
          className={`px-4 py-2 rounded-lg text-xs font-michroma transition-colors ${
            status === opt.value
              ? "bg-[#C3F001] border text-[#171717] border-[#C3F001]"
              : "bg-zinc-900 text-zinc-400hover:text-white"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
