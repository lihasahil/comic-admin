"use client";

import { useState } from "react";
import { Defect } from "@/services/submissionService";
import SeverityBadge from "./severity-badge";
import Image from "next/image";

interface Props {
  imageUrl: string;
  defects: Defect[];
}

const severityColors: Record<string, string> = {
  negligible: "bg-zinc-500 ring-zinc-400",
  minor: "bg-sky-500 ring-sky-300",
  moderate: "bg-amber-500 ring-amber-300",
  major: "bg-red-500 ring-red-300",
};

export default function DefectMap({ imageUrl, defects }: Props) {
  const [activeDefect, setActiveDefect] = useState<string | null>(null);
  const active = defects.find((d) => d.defect_key === activeDefect);

  return (
    <div className="space-y-3">
      {/* Image with overlay pins */}
      <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
        <div className="relative w-full" style={{ paddingBottom: "150%" }}>
          <Image
            src={imageUrl}
            alt="Comic front cover"
            fill
            className="object-cover"
            sizes="500px"
          />

          {/* Defect pins */}
          {defects.map((defect, idx) => (
            <button
              key={defect.defect_key}
              onClick={() =>
                setActiveDefect(
                  activeDefect === defect.defect_key ? null : defect.defect_key
                )
              }
              style={{
                position: "absolute",
                left: `${defect.x * 100}%`,
                top: `${defect.y * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
              className={`z-10 flex items-center justify-center font-sf-pro w-6 h-6 rounded-full text-white text-[10px] font-bold ring-2 transition-all hover:scale-125 focus:outline-none ${
                severityColors[defect.severity]
              } ${activeDefect === defect.defect_key ? "scale-125 ring-white" : ""}`}
              aria-label={defect.display_name}
            >
              {idx + 1}
            </button>
          ))}

          {/* Tooltip */}
          {active && (
            <div
              style={{
                position: "absolute",
                left: `${active.x * 100}%`,
                top: `${active.y * 100}%`,
                transform:
                  active.y > 0.7
                    ? "translate(-50%, -120%)"
                    : "translate(-50%, 30px)",
              }}
              className="z-20 pointer-events-none bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 min-w-44 shadow-xl"
            >
              <div className="text-xs font-medium font-sf-pro text-zinc-200 mb-1">
                {active.display_name}
              </div>
              <div className="flex items-center font-sf-pro justify-between gap-2">
                <span className="text-[10px] text-zinc-500">
                  {active.category}
                </span>
                <SeverityBadge severity={active.severity} size="xs" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Defect legend */}
      <div className="space-y-1.5">
        {defects.map((defect, idx) => (
          <button
            key={defect.defect_key}
            onClick={() =>
              setActiveDefect(
                activeDefect === defect.defect_key ? null : defect.defect_key
              )
            }
            className={`w-full flex items-center justify-between font-sf-pro gap-3 px-3 py-2 rounded-lg text-left transition-all ${
              activeDefect === defect.defect_key
                ? "bg-zinc-800 border border-zinc-700"
                : "hover:bg-zinc-900 border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`shrink-0 w-5 h-5 rounded-full font-michroma text-white text-[10px] font-bold flex items-center justify-center ring-1 ${severityColors[defect.severity]}`}
              >
                {idx + 1}
              </span>
              <div>
                <div className="text-xs font-medium text-zinc-300">
                  {defect.display_name}
                </div>
                <div className="text-[10px] text-zinc-600">{defect.category}</div>
              </div>
            </div>
            <SeverityBadge severity={defect.severity} size="xs" />
          </button>
        ))}
      </div>
    </div>
  );
}
