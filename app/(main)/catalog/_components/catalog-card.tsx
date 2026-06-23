"use client";

import { CatalogListItem } from "@/services/catalogService";
import { useRouter } from "next/navigation";
import { ChevronRight, Star, Layers } from "lucide-react";

interface Props {
  comic: CatalogListItem;
}

export default function CatalogCard({ comic }: Props) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/catalog/${comic.id}`)}
      className="w-full group text-left rounded-xl bg-[#111111B2] border border-[#FFFFFF33] transition-all duration-150 hover:border-[#FFFFFF55] overflow-hidden"
    >
      <div className="flex items-stretch gap-0">
        {/* Cover placeholder */}
        <div className="relative w-16 shrink-0 bg-[#1A1A1A] flex items-center justify-center">
          <div className="flex flex-col items-center gap-1 p-2">
            <Layers size={16} className="text-zinc-700" />
            <span className="text-[8px] text-zinc-700 font-michroma text-center leading-tight">
              {comic.publisher_name}
            </span>
          </div>
          {comic.key_issue_status && (
            <div className="absolute top-1.5 left-1.5">
              <Star size={10} className="text-[#C3F001] fill-[#C3F001]" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-3 space-y-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="text-sm font-michroma text-[#F1F1F1] truncate">
                {comic.series_name}
              </span>
              <span className="text-xs font-sf-pro text-[#888888]">
                #{comic.issue_number}
              </span>
              {comic.key_issue_status && (
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-[#C3F001]/10 text-[#C3F001] ring-1 ring-[#C3F001]/25">
                  Key Issue
                </span>
              )}

              {comic.is_variant && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-zinc-800 text-zinc-400 ring-1 ring-zinc-700">
                  Variant
                </span>
              )}
            </div>
            <ChevronRight
              size={14}
              className="text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0 mt-0.5"
            />
          </div>
          {comic.cover_artist && (
            <span className="font-sf-pro text-sm text-primary">
              <span className="text-[#888888]">Cover Artist:</span> {comic.cover_artist}
            </span>
          )}

          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xs text-[#888888] font-sf-pro">
              {comic.publisher_name}
            </span>

            <div className="h-3 w-px bg-zinc-800 hidden sm:block" />

            <span className="text-xs text-[#888888] font-sf-pro">
              {comic.publication_year}
              {comic.publication_month
                ? ` / ${comic.publication_month.padStart(2, "0")}`
                : ""}
            </span>

            {comic.volume && (
              <>
                <div className="h-3 w-px bg-zinc-800 hidden sm:block" />
                <span className="text-xs text-[#888888] font-sf-pro">
                  Vol. {comic.volume}
                </span>
              </>
            )}

            <div className="ml-auto flex items-center gap-3">
              {comic.cover_price && (
                <span className="text-xs text-zinc-500 font-sf-pro truncate max-w-30">
                  {comic.cover_price.split(";")[0].trim()}
                </span>
              )}
              <span className="text-[10px] text-zinc-700 font-mono">
                #{comic.id}
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
