"use client";

import { useState } from "react";
import { Defect } from "@/services/submissionService";
import Image from "next/image";
import { Check, X, ClipboardCheck } from "lucide-react";

interface Props {
  imageKey: string;
  imageUrl: string;
  defects: Defect[];
  onReviewClick: (imageKey: string, defect: Defect) => void;
}

const statusColors: Record<string, string> = {
  pending: "bg-zinc-600 ring-zinc-400",
  approved: "bg-primary ring-primary/60",
  rejected: "bg-red-500 ring-red-300",
};

function defectStatus(defect: Defect) {
  return defect.review?.status ?? "pending";
}

function defectRowKey(defect: Defect) {
  return `${defect.defect_key}_${defect.defect_index}`;
}

export default function DefectMap({
  imageKey,
  imageUrl,
  defects,
  onReviewClick,
}: Props) {
  const [activeDefect, setActiveDefect] = useState<string | null>(null);
  const active = defects.find((d) => defectRowKey(d) === activeDefect);

  const toggle = (defect: Defect) => {
    const key = defectRowKey(defect);
    setActiveDefect(activeDefect === key ? null : key);
  };

  return (
    <div className="space-y-3">
      {/* Image with overlay pins */}
      <div className="relative rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="relative w-full" style={{ paddingBottom: "150%" }}>
          <Image
            src={imageUrl}
            alt="Comic page"
            fill
            className="object-cover"
            sizes="500px"
          />

          {defects.map((defect, idx) => {
            const key = defectRowKey(defect);
            const status = defectStatus(defect);
            return (
              <button
                key={key}
                onClick={() => toggle(defect)}
                style={{
                  position: "absolute",
                  left: `${defect.x * 100}%`,
                  top: `${defect.y * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className={`z-10 flex items-center justify-center font-sf-pro w-6 h-6 rounded-full text-white text-[10px] font-bold ring-2 transition-all hover:scale-125 focus:outline-none ${
                  statusColors[status]
                } ${activeDefect === key ? "scale-125 ring-white" : ""}`}
                aria-label={defect.display_name}
              >
                {idx + 1}
              </button>
            );
          })}

          {/* Tooltip with Review button */}
          {active && (
            <div
              style={{
                position: "absolute",
                left: `${active.x * 100}%`,
                top: `${active.y * 100}%`,
                transform:
                  active.y > 0.7
                    ? "translate(-50%, -125%)"
                    : "translate(-50%, 30px)",
              }}
              className="z-20 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 min-w-44 shadow-xl"
            >
              <div className="text-xs font-medium font-sf-pro text-zinc-200 mb-1">
                {active.display_name}
              </div>
              <div className="flex items-center font-sf-pro justify-between gap-2 mb-2">
                <span className="text-[10px] text-zinc-500">
                  {active.category}
                </span>
                <StatusPill status={defectStatus(active)} />
              </div>
              <button
                onClick={() => onReviewClick(imageKey, active)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-sf-pro font-medium bg-primary text-zinc-900 hover:bg-primary/90 transition-colors"
              >
                <ClipboardCheck size={11} />
                {defectStatus(active) === "pending"
                  ? "Review"
                  : "Change review"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Defect legend */}
      <div className="space-y-1.5">
        {defects.map((defect, idx) => {
          const key = defectRowKey(defect);
          const status = defectStatus(defect);
          const isActive = activeDefect === key;

          return (
            <div
              key={key}
              className={`w-full rounded-lg transition-all ${
                isActive
                  ? "bg-zinc-800 border border-zinc-700"
                  : "border border-transparent hover:bg-zinc-900"
              }`}
            >
              <button
                onClick={() => toggle(defect)}
                className="w-full flex items-center justify-between gap-3 px-3 py-2 text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0 font-sf-pro">
                  <span
                    className={`shrink-0 w-5 h-5 rounded-full font-michroma text-white text-[10px] font-bold flex items-center justify-center ring-1 ${statusColors[status]}`}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-zinc-300 truncate">
                      {defect.display_name}
                    </div>
                    <div className="text-[10px] text-zinc-600 truncate">
                      {defect.category}
                    </div>
                  </div>
                </div>
                <StatusPill status={status} />
              </button>

              {isActive && (
                <div className="px-3 pb-2.5">
                  <button
                    onClick={() => onReviewClick(imageKey, defect)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-sf-pro font-medium bg-primary text-zinc-900 hover:bg-primary/90 transition-colors"
                  >
                    <ClipboardCheck size={11} />
                    {status === "pending" ? "Review" : "Change review"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  if (status === "approved") {
    return (
      <span className="shrink-0 text-[10px] font-sf-pro text-primary flex items-center gap-1">
        <Check size={10} /> Approved
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="shrink-0 text-[10px] font-sf-pro text-red-400 flex items-center gap-1">
        <X size={10} /> Rejected
      </span>
    );
  }
  return (
    <span className="shrink-0 text-[10px] font-sf-pro text-zinc-600">
      Pending
    </span>
  );
}
