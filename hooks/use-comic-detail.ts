import { useMemo } from "react";
import { CatalogDetail } from "@/services/catalogService";

// Types 

export type ValueSource = "real" | "est" | "extrap" | "highvar";

export interface ConditionRow {
  grade: number;
  label: string;
  rawValue: number | undefined;
  rawSource: ValueSource | undefined;
  cgcValue: number | undefined;
  cgcSource: ValueSource | undefined;
  dealer: { low: number; high: number; source: ValueSource | undefined } | undefined;
  bulk: { low: number; high: number; source: ValueSource | undefined } | undefined;
  convention: { low: number; high: number; source: ValueSource | undefined } | undefined;
  storeCredit: { low: number; high: number; source: ValueSource | undefined } | undefined;
}

export interface ComicValueData {
  status: "available" | "unavailable";
  rows: ConditionRow[];
  marketAvg: number;
  currency: string;
  aiGrade: number;
  userGrade: number | null;
  updatedAt: string;
}

// Helpers

function toRawSource(s: string): ValueSource {
  return s.toLowerCase() === "real" ? "real" : "est";
}

// Hook 

export function useComicValueData(comic: CatalogDetail | undefined): ComicValueData | undefined {
  return useMemo(() => {
    const snapshot = comic?.pricing_snapshot;
    if (!snapshot || snapshot.grades.length === 0) return undefined;

    const rows: ConditionRow[] = snapshot.grades.map((g) => {
      const cgcSource = g.type as ValueSource;
      return {
        grade: parseFloat(g.grade),
        label: g.label,
        rawValue: g.raw.est_value,
        rawSource: toRawSource(g.raw.source),
        cgcValue: g.graded.cgc_value,
        cgcSource,
        dealer: { ...g.sell_trade.dealer_offer, source: cgcSource },
        bulk: { ...g.sell_trade.bulk_lot, source: cgcSource },
        convention: { ...g.sell_trade.convention, source: cgcSource },
        storeCredit: { ...g.sell_trade.store_credit, source: cgcSource },
      };
    });

    return {
      status: "available",
      rows,
      marketAvg: snapshot.loose_price,
      currency: "USD",
      aiGrade: 0,
      userGrade: null,
      updatedAt: snapshot.updated_at,
    };
  }, [comic]);
}
