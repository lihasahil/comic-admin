import { DefectSeverity } from "@/services/submissionService";

interface Props {
  severity: DefectSeverity;
  size?: "sm" | "xs";
}

const config: Record<DefectSeverity, { label: string; className: string }> = {
  negligible: {
    label: "Negligible",
    className: "bg-zinc-800 text-zinc-400 ring-1 ring-zinc-700/50",
  },
  minor: {
    label: "Minor",
    className: "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/25",
  },
  moderate: {
    label: "Moderate",
    className: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/25",
  },
  major: {
    label: "Major",
    className: "bg-red-500/10 text-red-400 ring-1 ring-red-500/25",
  },
};

export default function SeverityBadge({ severity, size = "sm" }: Props) {
  const { label, className } = config[severity] ?? config.negligible;
  const sizeClass = size === "xs" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5";
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${className}`}>
      {label}
    </span>
  );
}
