"use client";

import { useStats, statsKeys } from "@/hooks/useStats";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  Users,
  UserCheck,
  GraduationCap,
  ScanLine,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Clock,
  ThumbsUp,
  Coins,
  ScanFace,
  RefreshCw,
  Loader2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  href?: string;
  accent?: string;
  description?: string;
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  href,
  accent = "border-[#FFFFFF33]",
  description,
}: StatCardProps) {
  const content = (
    <div
      className={`group relative rounded-xl bg-[#111111B2] border ${accent} p-5 flex flex-col gap-4 transition-all duration-200 ${
        href ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-lg ${iconBg}`}>
          <Icon size={17} className={iconColor} />
        </div>
        {href && (
          <ArrowRight
            size={14}
            className="text-zinc-700 group-hover:text-zinc-400 transition-colors mt-0.5"
          />
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-[#F1F1F1] font-michroma tabular-nums tracking-tight">
          {value.toLocaleString()}
        </div>
        <div className="text-sm flex gap-2 font-sf-pro items-center text-[#888888] mt-1">
          {label}
          {description && (
            <div className="text-xs font-medium text-zinc-700 mt-0.5">
              ({description})
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}

interface SectionProps {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  href?: string;
  children: React.ReactNode;
}

function Section({
  title,
  icon: Icon,
  iconColor,
  href,
  children,
}: SectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon size={14} className={iconColor} />
          <h2 className="text-sm text-[#F1F1F1] font-michroma tracking-wider">
            {title}
          </h2>
        </div>
        {href && (
          <Link
            href={href}
            className="text-xs text-[#888888] hover:text-[#F1F1F1] font-sf-pro flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={11} />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-5 animate-pulse">
      <div className="h-9 w-9 rounded-lg bg-zinc-800 mb-4" />
      <div className="h-8 w-16 rounded bg-zinc-800 mb-2" />
      <div className="h-3 w-24 rounded bg-zinc-800" />
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isFetching } = useStats();
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: statsKeys.all });
  };

  const totalFeedback =
    (data?.feedback.pending ?? 0) +
    (data?.feedback.approved ?? 0) +
    (data?.feedback.rejected ?? 0);

  const scanSuccessRate =
    data && data.scans.done + data.scans.failed > 0
      ? Math.round(
          (data.scans.done / (data.scans.done + data.scans.failed)) * 100,
        )
      : null;

  const onboardRate =
    data && data.users.total > 0
      ? Math.round((data.users.onboarded / data.users.total) * 100)
      : null;

  return (
    <div className="min-h-screen text-white">
      <div className="space-y-10">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold font-michroma tracking-tight text-white">
                Dashboard
              </h1>
            </div>
            <p className="text-sm text-[#888888] font-sf-pro">
              ComicSmith Platform overall stats
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="flex items-center justify-center font-michroma w-full md:w-xs bg-[#C3F001] text-[#171717] gap-2 rounded-lg px-5 py-2.5 text-[14px] transition-opacity hover:opacity-90 active:opacity-80"
          >
            {isFetching ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            Refresh
          </button>
        </div>

        {/* Users section */}
        <Section
          title="Users"
          icon={Users}
          iconColor="text-violet-400"
          href="/users"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                <StatCard
                  label="Total users"
                  value={data!.users.total}
                  icon={Users}
                  iconColor="text-violet-400"
                  iconBg="bg-violet-500/10"
                  href="/users"
                  accent="border-violet-500/20"
                />
                <StatCard
                  label="Active users"
                  value={data!.users.active}
                  icon={UserCheck}
                  iconColor="text-emerald-400"
                  iconBg="bg-emerald-500/10"
                  description={`${data!.users.total - data!.users.active} inactive`}
                />
                <StatCard
                  label="Onboarded"
                  value={data!.users.onboarded}
                  icon={GraduationCap}
                  iconColor="text-sky-400"
                  iconBg="bg-sky-500/10"
                  description={
                    onboardRate !== null
                      ? `${onboardRate}% completion rate`
                      : undefined
                  }
                />
              </>
            )}
          </div>
        </Section>

        {/* Feedback section */}
        <Section
          title="Feedback"
          icon={MessageSquare}
          iconColor="text-amber-400"
          href="/feedback"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                <StatCard
                  label="Pending review"
                  value={data!.feedback.pending}
                  icon={Clock}
                  iconColor="text-amber-400"
                  iconBg="bg-amber-500/10"
                  href="/feedback"
                  accent={
                    data!.feedback.pending > 0
                      ? "border-amber-500/30"
                      : "border-zinc-800"
                  }
                  description={
                    data!.feedback.pending > 0
                      ? "Action required"
                      : "All caught up"
                  }
                />
                <StatCard
                  label="Approved"
                  value={data!.feedback.approved}
                  icon={ThumbsUp}
                  iconColor="text-emerald-400"
                  iconBg="bg-emerald-500/10"
                  description={
                    totalFeedback > 0
                      ? `${Math.round((data!.feedback.approved / totalFeedback) * 100)}% approval rate`
                      : undefined
                  }
                />
                <StatCard
                  label="Rejected"
                  value={data!.feedback.rejected}
                  icon={XCircle}
                  iconColor="text-red-400"
                  iconBg="bg-red-500/10"
                />
              </>
            )}
          </div>
        </Section>

        {/* Scans + Submissions + Coins row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Scans */}
          <Section title="Scans" icon={ScanLine} iconColor="text-teal-400">
            <div className="grid grid-cols-3 gap-3">
              {isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                <>
                  <StatCard
                    label="Total"
                    value={data!.scans.total}
                    icon={ScanLine}
                    iconColor="text-teal-400"
                    iconBg="bg-teal-500/10"
                  />
                  <StatCard
                    label="Done"
                    value={data!.scans.done}
                    icon={CheckCircle2}
                    iconColor="text-emerald-400"
                    iconBg="bg-emerald-500/10"
                    description={
                      scanSuccessRate !== null
                        ? `${scanSuccessRate}% success`
                        : undefined
                    }
                  />
                  <StatCard
                    label="Failed"
                    value={data!.scans.failed}
                    icon={XCircle}
                    iconColor="text-red-400"
                    iconBg="bg-red-500/10"
                  />
                </>
              )}
            </div>
          </Section>

          {/* Manual submissions + Coins */}
          <div className="space-y-6">
            <Section
              title="Defect submissions"
              icon={ScanFace}
              iconColor="text-rose-400"
              href="/submissions"
            >
              <div className="grid grid-cols-2 gap-3">
                {isLoading ? (
                  <>
                    <SkeletonCard />
                    <SkeletonCard />
                  </>
                ) : (
                  <>
                    <StatCard
                      label="Pending"
                      value={data!.manual_submissions.pending}
                      icon={Clock}
                      iconColor="text-amber-400"
                      iconBg="bg-amber-500/10"
                      href="/submissions"
                      accent={
                        data!.manual_submissions.pending > 0
                          ? "border-amber-500/30"
                          : "border-zinc-800"
                      }
                    />
                    <StatCard
                      label="Reviewed"
                      value={data!.manual_submissions.reviewed}
                      icon={CheckCircle2}
                      iconColor="text-emerald-400"
                      iconBg="bg-emerald-500/10"
                    />
                  </>
                )}
              </div>
            </Section>

            <Section title="Economy" icon={Coins} iconColor="text-amber-400">
              <div className="grid grid-cols-1 gap-3">
                {isLoading ? (
                  <SkeletonCard />
                ) : (
                  <StatCard
                    label="Coins in circulation"
                    value={data!.coins.total_in_circulation}
                    icon={Coins}
                    iconColor="text-amber-400"
                    iconBg="bg-amber-500/10"
                    description="Awarded via approved feedback"
                  />
                )}
              </div>
            </Section>
          </div>
        </div>

        {/* Action prompts — only when there are pending items */}
        {data &&
          (data.feedback.pending > 0 ||
            data.manual_submissions.pending > 0) && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-amber-400" />
                <span className="text-sm font-medium font-michroma text-amber-400">
                  Action required
                </span>
              </div>
              <div className="flex flex-col font-sf-pro sm:flex-row gap-2">
                {data.feedback.pending > 0 && (
                  <Link
                    href="/feedback"
                    className="flex-1 flex items-center justify-between px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all group"
                  >
                    <div>
                      <div className="text-sm font-medium text-white">
                        {data.feedback.pending} feedback item
                        {data.feedback.pending !== 1 ? "s" : ""} pending
                      </div>
                      <div className="text-xs text-zinc-600 mt-0.5">
                        Waiting for review
                      </div>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-zinc-700 group-hover:text-zinc-400 transition-colors"
                    />
                  </Link>
                )}
                {data.manual_submissions.pending > 0 && (
                  <Link
                    href="/submissions"
                    className="flex-1 flex items-center justify-between px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all group"
                  >
                    <div>
                      <div className="text-sm font-medium text-white">
                        {data.manual_submissions.pending} defect submission
                        {data.manual_submissions.pending !== 1 ? "s" : ""}{" "}
                        pending
                      </div>
                      <div className="text-xs text-zinc-600 mt-0.5">
                        Waiting for review
                      </div>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-zinc-700 group-hover:text-zinc-400 transition-colors"
                    />
                  </Link>
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
