"use client";

import { CatalogMatch } from "@/services/scanCorrectionService";
import { Check, ImageOff, Star, Sparkles } from "lucide-react";
import Image from "next/image";

interface Props {
  match: CatalogMatch;
  selected: boolean;
  onSelect: (id: number) => void;
}

export default function CatalogMatchCard({ match, selected, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(match.id)}
      className={`w-full text-left rounded-lg border transition-all duration-150 overflow-hidden flex items-stretch gap-0 ${
        selected
          ? "border-primary bg-primary/10"
          : "border-[#FFFFFF1A] bg-[#0D0D0D] hover:border-[#FFFFFF33]"
      }`}
    >
      <div className="relative w-14 shrink-0 bg-[#111111B2] flex items-center justify-center">
        {match.image_url ? (
          <Image
            src={match.image_url}
            alt={match.series_name}
            fill
            className="object-cover"
            sizes="56px"
          />
        ) : (
          <ImageOff size={14} className="text-zinc-700" />
        )}
      </div>

      <div className="flex-1 px-3 py-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-sf-pro font-medium text-[#F1F1F1] truncate">
            {match.series_name}
            {match.issue_number ? ` #${match.issue_number}` : ""}
          </p>
          {selected && (
            <span className="shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-primary text-[#171717]">
              <Check size={11} />
            </span>
          )}
        </div>
        <p className="text-[10px] font-sf-pro text-[#888888] mt-0.5 truncate">
          {[match.publisher_name, match.publication_year]
            .filter(Boolean)
            .join(" · ") || "—"}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {match.cover_price && (
            <span className="text-[10px] font-sf-pro text-zinc-500">
              Cover: {match.cover_price}
            </span>
          )}
          {match.market_price_loose != null && (
            <span className="text-[10px] font-sf-pro text-primary">
              Market: ${match.market_price_loose.toFixed(2)}
            </span>
          )}
          {match.key_issue_status && (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-sf-pro text-amber-400">
              <Star size={9} /> Key
            </span>
          )}
          {match.is_variant && (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-sf-pro text-zinc-500">
              <Sparkles size={9} /> Variant
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
