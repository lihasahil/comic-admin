"use client";

import { ScanCorrectionListItem } from "@/services/scanCorrectionService";
import { useRouter } from "next/navigation";
import { User, Clock, ChevronRight, ImageOff } from "lucide-react";
import Image from "next/image";

interface Props {
  correction: ScanCorrectionListItem;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const statusStyles = {
  pending: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/25",
  approved: "bg-primary/10 text-primary ring-1 ring-primary/25",
  rejected: "bg-red-500/10 text-red-400 ring-1 ring-red-500/25",
};

function comicLabel(info: {
  title: string | null;
  issue_number: string | null;
}) {
  if (!info.title) return "—";
  return info.issue_number ? `${info.title} #${info.issue_number}` : info.title;
}

export default function ScanCorrectionCard({ correction }: Props) {
  const router = useRouter();

  return (
    <button
      onClick={() =>
        router.push(`/scan-corrections/${correction.correction_id}`)
      }
      className="w-full group text-left rounded-xl bg-[#111111B2] border border-[#FFFFFF33] transition-all duration-150 overflow-hidden"
    >
      <div className="flex items-stretch gap-0">
        {/* Thumbnail */}
        <div className="relative w-24 shrink-0 bg-[#111111B2] flex items-center justify-center">
          {correction.scan_thumbnail ? (
            <Image
              src={correction.scan_thumbnail}
              alt="Comic scan"
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <ImageOff size={18} className="text-zinc-700" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-3 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 font-sf-pro rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  statusStyles[correction.status]
                }`}
              >
                {correction.status.charAt(0).toUpperCase() +
                  correction.status.slice(1)}
              </span>
              <span className="text-[10px] text-[#888888] font-sf-pro">
                #{correction.correction_id} · {correction.comic_scan_id}
              </span>
            </div>
            <ChevronRight
              size={14}
              className="text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0 mt-0.5"
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="min-w-0">
              <div className="text-[9px] text-[#888888] font-sf-pro uppercase">
                System found
              </div>
              <div className="text-xs font-sf-pro text-[#F1F1F1] truncate max-w-[220px]">
                {comicLabel(correction.system_found)}
              </div>
            </div>

            <div className="min-w-0">
              <div className="text-[9px] text-[#888888] font-sf-pro uppercase">
                User says
              </div>
              <div className="text-xs font-sf-pro text-primary truncate max-w-[220px]">
                {comicLabel(correction.user_says)}
              </div>
            </div>

            {/* User */}
            <div className="flex items-center gap-1 text-xs text-[#888888] font-sf-pro">
              <User size={11} />
              {correction.user.full_name ?? "Anonymous"}
            </div>

            {/* Date */}
            <div className="flex items-center gap-1 text-xs text-[#888888] font-sf-pro ml-auto">
              <Clock size={11} />
              {formatDate(correction.created_at)}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
