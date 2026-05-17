"use client";

import { SubmissionListItem } from "@/services/submissionService";
import { useRouter } from "next/navigation";
import { User, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Props {
  submission: SubmissionListItem;
}

function formatDate(iso: string) {
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
  reviewed: "bg-zinc-700 text-zinc-400 ring-1 ring-zinc-600/50",
};

function gradeColor(val: number) {
  if (val >= 9) return "text-emerald-400";
  if (val >= 7) return "text-amber-400";
  if (val >= 5) return "text-orange-400";
  return "text-red-400";
}

export default function SubmissionCard({ submission }: Props) {
  const router = useRouter();
  const aiNum = parseFloat(submission.ai_grade_value);
  const diff = aiNum - submission.user_grade_value;

  return (
    <button
      onClick={() => router.push(`/submissions/${submission.submission_id}`)}
      className="w-full group text-left rounded-xl bg-[#111111B2] border border-[#FFFFFF33] transition-all duration-150 overflow-hidden"
    >
      <div className="flex items-stretch gap-0">
        {/* Thumbnail */}
        <div className="relative w-24 shrink-0 bg-[#111111B2]">
          <Image
            src={submission.front_image_url}
            alt="Comic cover"
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-3 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 font-sf-pro rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  statusStyles[submission.status]
                }`}
              >
                {submission.status.charAt(0).toUpperCase() +
                  submission.status.slice(1)}
              </span>
              <span className="text-[10px] text-[#888888] font-sf-pro">
                {submission.submission_id}
              </span>
            </div>
            <ChevronRight
              size={14}
              className="text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0 mt-0.5"
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Grades */}
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="text-[9px] text-[#888888] font-sf-pro uppercase">
                  User Grading
                </div>
                <div className={`text-sm font-michroma font-bold text-primary`}>
                  {submission.user_grade_value}
                </div>
                <div className="text-[9px] font-sf-pro text-[#F1F1F1]">
                  {submission.user_grade_label}
                </div>
              </div>
              <div
                className={`text-xs font-medium ${
                  diff > 0
                    ? "text-primary"
                    : diff < 0
                      ? "text-red-500"
                      : "text-zinc-600"
                }`}
              >
                {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}
              </div>
              <div className="text-center">
                <div className="text-[9px] uppercase font-sf-pro text-[#888888]">
                  AI Grading
                </div>
                <div className={`text-sm font-bold font-michroma text-primary`}>
                  {submission.ai_grade_value}
                </div>
                <div className="text-[9px] text-[#F1F1F1] font-sf-pro">
                  {submission.ai_grade_label}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-zinc-800 hidden sm:block" />

            {/* Defect count */}
            <div className="flex items-center gap-1 text-xs text-[#888888] font-sf-pro">
              <AlertTriangle size={11} className="text-amber-500/70" />
              {submission.defect_count} defect
              {submission.defect_count !== 1 ? "s" : ""}
            </div>

            {/* User */}
            <div className="flex items-center gap-1 text-xs text-[#888888] font-sf-pro">
              <User size={11} />
              {submission.user.full_name ?? "Anonymous"}
            </div>

            {/* Date */}
            <div className="flex items-center gap-1 text-xs text-[#888888] font-sf-pro ml-auto">
              <Clock size={11} />
              {formatDate(submission.created_at)}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
