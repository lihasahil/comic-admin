"use client";

import { Feedback } from "@/services/feedbackService";
import { useFeedbackActions } from "@/hooks/useFeedback";
import StatusBadge from "./StatusBadge";
import ImageGallery from "./ImageGallery";
import { Check, X, User, Clock, Loader2 } from "lucide-react";

interface Props {
  feedback: Feedback;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FeedbackCard({ feedback }: Props) {
  const { approve, reject, isApproving, isRejecting, isLoading } =
    useFeedbackActions(feedback.feedback_id);

  const isPending = feedback.status === "pending";
  const userName =
    feedback.user.full_name ?? feedback.user.username ?? "Anonymous";
  const hasUser = !!feedback.user.user_id;

  return (
    <div className="group relative rounded-xl bg-[#111111B2] border border-[#FFFFFF33] hover:border-zinc-700/80 transition-all duration-200 overflow-hidden">
      {/* Left accent stripe */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-0.5 transition-colors ${
          feedback.status === "approved"
            ? "bg-primary"
            : feedback.status === "rejected"
              ? "bg-red-500"
              : "bg-amber-500"
        }`}
      />

      <div className="p-4 pl-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={feedback.status} />
            {feedback.title && (
              <span className="text-xs font-medium text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded-full">
                {feedback.title}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-sf-pro text-zinc-600">
            <Clock size={11} />
            {formatDate(feedback.created_at)}
          </div>
        </div>

        {/* Content */}
        <p className="mt-3 text-sm font-sf-pro text-zinc-300 leading-relaxed">
          {feedback.content}
        </p>

        {/* Images */}
        <ImageGallery images={feedback.images} />

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
          {/* User info */}
          <div className="flex items-center font-sf-pro gap-1.5">
            <div className="h-6 w-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <User size={11} className="text-zinc-500" />
            </div>
            <div className="text-xs">
              {hasUser ? (
                <>
                  <span className="text-zinc-300 font-medium">{userName}</span>
                  <span className="text-zinc-600 ml-1">
                    · {feedback.user.email}
                  </span>
                </>
              ) : (
                <span className="text-zinc-600 font-sf-pro italic">Anonymous user</span>
              )}
            </div>
          </div>

          {/* ID */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#888888] font-sf-pro">
              {feedback.feedback_id}
            </span>
          </div>
        </div>

        {/* Actions — only for pending */}
        {isPending && (
          <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center gap-2">
            <button
              onClick={approve}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 font-michroma rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isApproving ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Check size={12} />
              )}
              Approve
            </button>

            <button
              onClick={reject}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 font-michroma rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isRejecting ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <X size={12} />
              )}
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
