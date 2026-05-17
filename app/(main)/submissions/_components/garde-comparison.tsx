interface Props {
  userGradeValue: number;
  userGradeLabel: string;
  aiGradeValue: string;
  aiGradeLabel: string;
}

function gradeColor(val: number) {
  if (val >= 9) return "text-emerald-400";
  if (val >= 7) return "text-amber-400";
  if (val >= 5) return "text-orange-400";
  return "text-red-400";
}

export default function GradeComparison({
  userGradeValue,
  userGradeLabel,
  aiGradeValue,
  aiGradeLabel,
}: Props) {
  const aiNum = parseFloat(aiGradeValue);
  const diff = aiNum - userGradeValue;

  return (
    <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
      <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium mb-4">
        Grade comparison
      </p>

      <div className="flex items-center gap-3">
        {/* User grade */}
        <div className="flex-1 rounded-lg bg-[#C3F0011A] border border-[#C3F0014D] p-3 text-center">
          <div className="text-[10px] text-[#888888] font-sf-pro uppercase tracking-wider mb-1">
            Manual Grading
          </div>
          <div
            className={`text-2xl font-bold font-michroma tabular-nums text-primary`}
          >
            {userGradeValue}
          </div>
          <div className="text-xs text-[#888888] font-sf-pro mt-0.5">
            {userGradeLabel}
          </div>
        </div>

        {/* Diff arrow */}
        <div className="flex flex-col items-center gap-1">
          <div
            className={`text-sm font-michroma font-semibold ${
              diff > 0
                ? "text-primary"
                : diff < 0
                  ? "text-red-400"
                  : "text-zinc-600"
            }`}
          >
            {diff > 0
              ? `+${diff.toFixed(1)}`
              : diff < 0
                ? diff.toFixed(1)
                : "="}
          </div>
          <div className="text-[#888888] font-sf-pro text-xs">vs</div>
        </div>

        {/* AI grade */}
        <div className="flex-1 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] p-3 text-center">
          <div className="text-[10px] text-[#888888] font-sf-pro uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
            AI Grading
          </div>
          <div
            className={`text-2xl font-bold tabular-nums font-michroma text-primary`}
          >
            {aiGradeValue}
          </div>
          <div className="text-xs text-[#888888] font-sf-pro mt-0.5">{aiGradeLabel}</div>
        </div>
      </div>
    </div>
  );
}
