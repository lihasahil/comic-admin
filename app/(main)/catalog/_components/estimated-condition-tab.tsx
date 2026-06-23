"use client";

import { useState } from "react";
import {
  type ComicValueData,
  type ConditionRow,
  type ValueSource,
} from "@/hooks/use-comic-detail";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EstimatedConditionTabProps {
  data: ComicValueData | undefined;
  isLoading: boolean;
  error: Error | null;
}

type MainTab = "raw" | "cgc" | "sell";
type SellSubTab = "dealer" | "bulk" | "convention" | "store";

// ─── Source Badge ─────────────────────────────────────────────────────────────

function SourceBadge({ source }: { source: ValueSource | undefined }) {
  if (!source) return <span className="text-[#888888] text-[11px]">—</span>;

  if (source === "real") {
    return (
      <span className="inline-flex font-sf-pro items-center gap-1.5 px-2.5 py-1 w-full rounded-full border border-[#C3F00133] bg-[#C3F00115] text-[11px] text-[#C3F001] justify-center whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-[#C3F001] shrink-0" />
        Verified
      </span>
    );
  } else if (source === "est") {
    return (
      <span className="inline-flex font-sf-pro items-center gap-1.5 px-2.5 py-1 w-full rounded-full border border-[#FF8132] text-[11px] text-[#FF8132] justify-center whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-[#FF8132] shrink-0" />
        From Estimate
      </span>
    );
  } else if (source === "highvar") {
    return (
      <span className="inline-flex font-sf-pro items-center gap-1.5 px-2.5 py-1 w-full rounded-full border border-[#FF0000] text-[11px] text-[#FF0000] justify-center whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-[#FF0000] shrink-0" />
        High Variance
      </span>
    );
  }

  return (
    <span className="inline-flex w-full font-sf-pro items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#FFFFFF22] bg-[#FFFFFF08] text-[11px] text-[#DDDDDD] justify-center whitespace-nowrap">
      <span className="w-2 h-2 rounded-full bg-[#DDDDDD] shrink-0" />
      Extrapolated
    </span>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number | undefined) =>
  n !== undefined
    ? `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
    : "—";

function getSellData(row: ConditionRow, subTab: SellSubTab) {
  switch (subTab) {
    case "dealer":
      return row.dealer;
    case "bulk":
      return row.bulk;
    case "convention":
      return row.convention;
    case "store":
      return row.storeCredit;
  }
}

const BANNER: Record<
  MainTab,
  { text: React.ReactNode; accent: string; bg: string; border: string }
> = {
  raw: {
    accent: "#C3F001",
    bg: "#C3F00108",
    border: "#C3F00133",
    text: (
      <>
        Raw values represent ungraded market prices. Copies sell at a discount
        versus CGC-graded copies because condition is unverified by a third
        party.
      </>
    ),
  },
  cgc: {
    accent: "#25B5FE",
    bg: "#25B5FE08",
    border: "#25B5FE33",
    text: (
      <>
        CGC-graded values reflect authenticated, slabbed copies.{" "}
        <span className="text-[#25B5FE] font-semibold">Grading fees</span> and
        encapsulation premium are included in these estimates.
      </>
    ),
  },
  sell: {
    accent: "#FF8800",
    bg: "#FF880008",
    border: "#FF880033",
    text: (
      <>
        Sell / trade prices represent what dealers typically offer.{" "}
        <span className="text-[#FF8800] font-semibold">
          30–50% of raw market value
        </span>{" "}
        is the industry average — dealers price in resale margin and risk.
      </>
    ),
  },
};

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-4 bg-[#111111B2] border border-[#FFFFFF33] p-4 rounded-xl animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-64 rounded bg-[#1A1A1A]" />
        <div className="h-3 w-80 rounded bg-[#1A1A1A]" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-24 rounded-full bg-[#1A1A1A]" />
        <div className="h-8 w-24 rounded-full bg-[#1A1A1A]" />
        <div className="h-8 w-24 rounded-full bg-[#1A1A1A]" />
      </div>
      <div className="h-10 rounded-lg bg-[#1A1A1A]" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="h-4 w-10 rounded bg-[#1A1A1A]" />
          <div className="h-4 w-20 rounded bg-[#1A1A1A]" />
          <div className="h-4 w-14 rounded bg-[#1A1A1A]" />
          <div className="h-4 w-28 rounded bg-[#1A1A1A]" />
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function EstimatedConditionTab({
  data,
  isLoading,
  error,
}: EstimatedConditionTabProps) {
  const [mainTab, setMainTab] = useState<MainTab>("raw");
  const [sellSubTab, setSellSubTab] = useState<SellSubTab>("dealer");

  if (isLoading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-48 bg-[#111111B2] border border-[#FFFFFF33] rounded-xl text-[#888888] text-[13px]">
        Failed to load value data.
      </div>
    );
  }

  if (!data || data.status !== "available" || data.rows.length === 0) {
    return (
      <div className="flex items-center justify-center flex-col font-sf-pro h-65 bg-[#111111B2] border border-[#FFFFFF33] rounded-xl text-[#888888] text-[13px]">
        <Image
          src="/no-comic.svg"
          alt="No Comic"
          height={0}
          width={0}
          className="size-60"
        />
        <span className="mb-4">Value data not available for this comic.</span>
      </div>
    );
  }

  const { rows, marketAvg, currency, aiGrade, userGrade, updatedAt } = data;
  const banner = BANNER[mainTab];

  const mainTabs: { id: MainTab; label: string }[] = [
    { id: "raw", label: "Raw" },
    { id: "cgc", label: "CGC Graded" },
    { id: "sell", label: "Sell / Trade" },
  ];

  const sellSubTabs: { id: SellSubTab; label: string }[] = [
    { id: "dealer", label: "Dealer Offer" },
    { id: "bulk", label: "Bulk Lot" },
    { id: "convention", label: "Convention" },
    { id: "store", label: "Store Credit" },
  ];

  return (
    <div className="space-y-4 bg-[#111111B2] border border-[#FFFFFF33] p-4 rounded-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-[15px] font-michroma text-[#F1F1F1] mb-1">
            Value by Estimated Condition
          </h2>
          <p className="text-[11px] font-sf-pro text-[#888888]">
            Estimated market values at each standard grading scale
          </p>
        </div>

        {/* Market summary chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-[#C3F00115] border border-[#C3F00130] rounded-lg px-3 py-1.5 text-center">
            <div className="text-[14px] font-michroma text-[#C3F001]">
              {currency === "USD" ? "$" : currency}
              {marketAvg.toLocaleString()}
            </div>
            <div className="text-[10px] font-sf-pro text-[#888888]">
              Market Avg
            </div>
          </div>
          {aiGrade > 0 && (
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-1.5 text-center">
              <div className="text-[14px] font-michroma text-[#F1F1F1]">
                {aiGrade.toFixed(1)}
              </div>
              <div className="text-[10px] font-sf-pro text-[#888888]">
                AI Grade
              </div>
            </div>
          )}
          {userGrade !== null && (
            <div className="bg-[#C3F00115] border border-[#C3F00130] rounded-lg px-3 py-1.5 text-center">
              <div className="text-[14px] font-michroma text-[#C3F001]">
                {userGrade.toFixed(1)}
              </div>
              <div className="text-[10px] text-[#888888]">User Grade</div>
            </div>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 bg-[#0D0D0D] border border-[#C3F001] rounded-full p-1">
          {mainTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMainTab(tab.id)}
              className="px-4 py-1.5 rounded-full text-[12px] font-michroma transition-all duration-200"
              style={{
                background: mainTab === tab.id ? "#C3F001" : "transparent",
                color: mainTab === tab.id ? "#171717" : "#888888",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sell sub-tabs */}
        {mainTab === "sell" && (
          <div className="flex items-center gap-1 bg-[#0D0D0D] border border-[#FF8800] rounded-full p-1 flex-wrap">
            {sellSubTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSellSubTab(tab.id)}
                className="px-3 py-1.5 rounded-full text-[11px] font-michroma transition-all duration-200"
                style={{
                  background: sellSubTab === tab.id ? "#FF8800" : "transparent",
                  color: sellSubTab === tab.id ? "#171717" : "#888888",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div
        className="p-3 rounded-lg border font-sf-pro text-[11px] text-[#CCCCCC] leading-5"
        style={{ background: banner.bg, borderColor: banner.border }}
      >
        {banner.text}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#FFFFFF1A]">
              <th className="text-center py-3 px-3 text-[12px] font-michroma font-medium text-[#F1F1F1] tracking-wider">
                Grade
              </th>
              <th className="text-center py-3 px-3 text-[12px] font-michroma font-medium text-[#F1F1F1] tracking-wider">
                Label
              </th>

              {mainTab === "raw" && (
                <th className="text-center py-3 px-3 text-[12px] font-michroma font-medium text-[#F1F1F1] tracking-wider">
                  Raw Est. Value
                </th>
              )}

              {mainTab === "cgc" && (
                <th className="text-center py-3 px-3 text-[12px] font-michroma font-medium text-[#F1F1F1] tracking-wider">
                  CGC Value
                </th>
              )}

              {mainTab === "sell" && (
                <>
                  <th className="text-center py-3 px-3 text-[12px] font-michroma font-medium text-[#F1F1F1] tracking-wider">
                    Low Offer
                  </th>
                  <th className="text-center py-3 px-3 text-[12px] font-michroma font-medium text-[#F1F1F1] tracking-wider">
                    High Offer
                  </th>
                </>
              )}

              <th className="text-center py-3 px-3 text-[12px] font-michroma font-medium text-[#F1F1F1] tracking-wider">
                Source
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const isActive = aiGrade > 0 && row.grade === aiGrade;
              const sellData =
                mainTab === "sell" ? getSellData(row, sellSubTab) : undefined;

              const activeSource: ValueSource | undefined =
                mainTab === "raw"
                  ? row.rawSource
                  : mainTab === "cgc"
                    ? row.cgcSource
                    : sellData?.source;

              return (
                <tr
                  key={`${row.grade}-${index}`}
                  className="border-b border-[#FFFFFF08] transition-colors hover:bg-[#FFFFFF05]"
                  style={
                    isActive
                      ? {
                          background: "#C3F00115",
                          outline: "1px solid #C3F001",
                          outlineOffset: "-1px",
                        }
                      : {}
                  }
                >
                  {/* Grade */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className="text-[13px] font-michroma"
                      style={{ color: isActive ? "#C3F001" : "#F1F1F1" }}
                    >
                      {row.grade.toFixed(1)}
                      {isActive && (
                        <span className="ml-1.5 text-[9px] bg-[#C3F001] text-[#171717] px-1.5 py-0.5 rounded-full font-michroma align-middle">
                          YOU
                        </span>
                      )}
                    </span>
                  </td>

                  {/* Label */}
                  <td className="py-3 px-3 text-center">
                    <span className="text-[11px] font-sf-pro text-[#888888] uppercase tracking-wider">
                      {row.label}
                    </span>
                  </td>

                  {/* Raw value */}
                  {mainTab === "raw" && (
                    <td className="py-3 px-3 text-center">
                      <span
                        className="text-[13px] font-michroma"
                        style={{ color: isActive ? "#C3F001" : "#F1F1F1" }}
                      >
                        {fmt(row.rawValue)}
                      </span>
                    </td>
                  )}

                  {/* CGC value */}
                  {mainTab === "cgc" && (
                    <td className="py-3 px-3 text-center">
                      <span
                        className="text-[13px] font-michroma"
                        style={{ color: isActive ? "#C3F001" : "#F1F1F1" }}
                      >
                        {fmt(row.cgcValue)}
                      </span>
                    </td>
                  )}

                  {/* Sell low / high */}
                  {mainTab === "sell" && (
                    <>
                      <td className="py-3 px-3 text-center">
                        <span
                          className="text-[13px] font-michroma"
                          style={{ color: isActive ? "#C3F001" : "#F1F1F1" }}
                        >
                          {fmt(sellData?.low)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className="text-[13px] font-michroma"
                          style={{ color: isActive ? "#C3F001" : "#F1F1F1" }}
                        >
                          {fmt(sellData?.high)}
                        </span>
                      </td>
                    </>
                  )}

                  {/* Source */}
                  <td className="py-3 px-3 text-center">
                    <SourceBadge source={activeSource} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <p className="text-[10px] text-[#555555] text-right">
        Updated {new Date(updatedAt).toLocaleDateString()}
      </p>
    </div>
  );
}
