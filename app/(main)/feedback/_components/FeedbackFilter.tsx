"use client";

import { FeedbackStatus } from "@/services/feedbackService";

type FilterOption = FeedbackStatus | "all";

interface Props {
  value: FilterOption;
  onChange: (v: FilterOption) => void;
}

const options: { label: string; value: FilterOption }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function FeedbackFilter({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 bg-[#111111B2] font-michroma border border-[#FFFFFF33] rounded-xl p-1 w-full md:w-fit overflow-x-auto">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all 
            `}
          style={{
            color: value === opt.value ? "#171717" : "#888888",
            background: value === opt.value ? "#C3F001" : "transparent",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
