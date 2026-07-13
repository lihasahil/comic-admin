"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useCatalogComic,
  useCatalogComicWithPricingRefresh,
  useRecalculatePricing,
} from "@/hooks/useCatalog";
import { useComicValueData } from "@/hooks/use-comic-detail";
import {
  ArrowLeft,
  Loader2,
  BookOpen,
  Star,
  Layers,
  DollarSign,
  Tag,
  Pencil,
  RefreshCw,
} from "lucide-react";
import ComicFormModal from "../_components/comic-form-modal";
import { EstimatedConditionTab } from "../_components/estimated-condition-tab";

function Field({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <dt className="text-[10px] text-zinc-600 uppercase tracking-wider">
        {label}
      </dt>
      <dd className="text-xs text-zinc-300 mt-0.5 leading-relaxed">{value}</dd>
    </div>
  );
}

function PriceRow({
  label,
  value,
}: {
  label: string;
  value: number | null | undefined;
}) {
  if (value === null || value === undefined) return null;
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-zinc-800 last:border-0">
      <span className="text-xs text-zinc-500 font-sf-pro">{label}</span>
      <span className="text-xs font-medium font-michroma text-[#C3F001]">
        ${value.toFixed(2)}
      </span>
    </div>
  );
}

export default function CatalogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);

  const { data, isLoading, isError, error, isRefreshingPricing } =
    useCatalogComicWithPricingRefresh(id);
  const valueData = useComicValueData(data);
  const recalculate = useRecalculatePricing(id);

  {
    isRefreshingPricing && (
      <span className="text-[10px] text-zinc-600 font-sf-pro">
        Refreshing prices…
      </span>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-zinc-600" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <BookOpen size={32} className="text-zinc-700" />
        <p className="text-sm text-zinc-500">Comic not found.</p>
        <button
          onClick={() => router.back()}
          className="text-xs text-amber-400 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const hasMarketPrices =
    data.market_price_loose ||
    data.market_price_complete ||
    data.market_price_new ||
    data.market_price_graded;

  const hasGradePrices =
    data.price_grade_40 ||
    data.price_grade_60 ||
    data.price_grade_80 ||
    data.price_grade_92 ||
    data.price_grade_94 ||
    data.price_grade_98 ||
    data.price_grade_100;

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-2 text-sm text-zinc-500 hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft size={14} />
          </button>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold font-michroma text-[#FFFFFF]">
                {data.series_name} #{data.issue_number}
              </h1>
              {data.key_issue_status && (
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-[#C3F001]/10 text-[#C3F001] ring-1 ring-[#C3F001]/25">
                  <Star size={8} className="fill-[#C3F001]" /> Key Issue
                </span>
              )}
              {data.is_variant && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-zinc-800 text-zinc-400 ring-1 ring-zinc-700">
                  Variant
                </span>
              )}
            </div>
            <p className="text-xs font-sf-pro text-[#888888] mt-0.5">
              {data.publisher_name} · {data.publication_year}
              {data.publication_month
                ? ` / ${data.publication_month.padStart(2, "0")}`
                : ""}{" "}
              · ID {data.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {hasMarketPrices && hasGradePrices && (
            <button
              onClick={() => recalculate.mutate()}
              disabled={recalculate.isPending}
              className="flex items-center gap-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-2 text-xs font-michroma text-zinc-400 hover:text-[#C3F001] hover:border-[#C3F001]/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                size={13}
                className={recalculate.isPending ? "animate-spin" : ""}
              />
              Recalculate
            </button>
          )}
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-2 text-xs font-michroma text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
          >
            <Pencil size={13} />
            Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left column */}
        <div className="space-y-5">
          {/* Cover placeholder + key details */}
          <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
            <div className="flex gap-5">
              {/* Cover placeholder */}
              <div className="w-28 shrink-0 aspect-2/3 rounded-lg bg-[#1A1A1A] border border-zinc-800 flex items-center justify-center">
                {data.image_url ? (
                  <img
                    src={data.image_url}
                    alt="Image"
                    className="object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Layers size={20} className="text-zinc-700" />
                    <span className="text-[9px] text-zinc-700 font-michroma text-center">
                      {data.publisher_name}
                    </span>
                  </div>
                )}
              </div>

              {/* Core info */}
              <dl className="space-y-2.5 font-sf-pro flex-1 grid grid-cols-3 min-w-0">
                <Field label="Series" value={data.series_name} />
                <Field label="Issue Number" value={data.issue_number} />
                {data.volume && <Field label="Volume" value={data.volume} />}
                <Field label="Publisher" value={data.publisher_name} />
                {data.imprint && <Field label="Imprint" value={data.imprint} />}
                <Field
                  label="Publication"
                  value={`${data.publication_year}${data.publication_month ? ` / ${data.publication_month.padStart(2, "0")}` : ""}`}
                />
                <Field label="Series Began" value={data.series_year_began} />
                <Field label="Cover Price" value={data.cover_price} />
                {data.cover_artist && (
                  <Field label="Cover Artist" value={data.cover_artist} />
                )}
                {data.page_count && (
                  <Field
                    label="Page Count"
                    value={`${data.page_count} pages`}
                  />
                )}
              </dl>
            </div>
          </div>

          {/* Physical details */}
          {(data.dimensions ||
            data.paper_stock ||
            data.binding_type ||
            data.cover_type ||
            data.printing_edition) && (
            <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
              <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium mb-3">
                Physical Details
              </p>
              <dl className="space-y-2.5 font-sf-pro">
                <Field label="Dimensions" value={data.dimensions} />
                <Field label="Paper Stock" value={data.paper_stock} />
                <Field label="Binding" value={data.binding_type} />
                <Field label="Cover Type" value={data.cover_type} />
                <Field label="Printing Edition" value={data.printing_edition} />
              </dl>
            </div>
          )}

          {/* Editorial notes */}
          {(data.first_appearances ||
            data.origin_stories ||
            data.death_return_characters ||
            data.costume_identity_changes ||
            data.crossover_events ||
            data.historic_significance ||
            data.additional_notes ||
            data.cover_description) && (
            <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
              <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium mb-3">
                Editorial Notes
              </p>
              <dl className="space-y-3 font-sf-pro">
                <Field
                  label="Cover Description"
                  value={data.cover_description}
                />
                <Field
                  label="First Appearances"
                  value={data.first_appearances}
                />
                <Field label="Origin Stories" value={data.origin_stories} />
                <Field
                  label="Death / Return"
                  value={data.death_return_characters}
                />
                <Field
                  label="Costume / Identity Changes"
                  value={data.costume_identity_changes}
                />
                <Field label="Crossover Events" value={data.crossover_events} />
                <Field
                  label="Historic Significance"
                  value={data.historic_significance}
                />
                <Field label="Additional Notes" value={data.additional_notes} />
              </dl>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Market prices */}
          {hasMarketPrices && (
            <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign size={13} className="text-[#C3F001]" />
                <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium">
                  Market Prices
                </p>
              </div>
              <PriceRow label="Loose" value={data.market_price_loose} />
              <PriceRow label="Complete" value={data.market_price_complete} />
              <PriceRow label="New / Sealed" value={data.market_price_new} />
              <PriceRow label="Graded" value={data.market_price_graded} />
              {data.price_last_updated && (
                <p className="text-[10px] text-zinc-700 font-sf-pro mt-2.5">
                  Updated{" "}
                  {new Date(data.price_last_updated).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                </p>
              )}
            </div>
          )}

          {/* Grade prices */}
          {hasGradePrices && (
            <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={13} className="text-zinc-400" />
                <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium">
                  Prices by Grade
                </p>
              </div>
              <PriceRow label="4.0 (VG)" value={data.price_grade_40} />
              <PriceRow label="6.0 (FN)" value={data.price_grade_60} />
              <PriceRow label="8.0 (VF)" value={data.price_grade_80} />
              <PriceRow label="9.2 (NM-)" value={data.price_grade_92} />
              <PriceRow label="9.4 (NM)" value={data.price_grade_94} />
              <PriceRow label="9.8 (NM/MT)" value={data.price_grade_98} />
              <PriceRow label="10.0 (GM)" value={data.price_grade_100} />
            </div>
          )}

          {/* Identifiers */}
          <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
            <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium mb-3">
              Identifiers
            </p>
            <dl className="space-y-2.5 font-sf-pro">
              <div>
                <dt className="text-[10px] text-zinc-600 uppercase tracking-wider">
                  Barcode
                </dt>
                <dd className="text-xs text-zinc-400 font-mono mt-0.5">
                  {data.barcode || "—"}
                </dd>
              </div>
              {data.isbn && (
                <div>
                  <dt className="text-[10px] text-zinc-600 uppercase tracking-wider">
                    ISBN
                  </dt>
                  <dd className="text-xs text-zinc-400 font-mono mt-0.5">
                    {data.isbn}
                  </dd>
                </div>
              )}
              <Field label="GCD Issue ID" value={data.gcd_issue_id} />
              <Field label="GCD Series ID" value={data.gcd_series_id} />
              {data.pricecharting_id && (
                <Field label="PriceCharting ID" value={data.pricecharting_id} />
              )}
              {data.total_variant_count > 0 && (
                <Field label="Variant Count" value={data.total_variant_count} />
              )}
            </dl>
          </div>

          {/* Distribution */}
          {(data.distribution_type ||
            data.regional_variants ||
            data.recall_pulped ||
            data.low_distribution_status ||
            data.print_run_numbers) && (
            <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
              <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium mb-3">
                Distribution
              </p>
              <dl className="space-y-2.5 font-sf-pro">
                <Field
                  label="Distribution Type"
                  value={data.distribution_type}
                />
                <Field
                  label="Regional Variants"
                  value={data.regional_variants}
                />
                <Field label="Recall / Pulped" value={data.recall_pulped} />
                <Field
                  label="Low Distribution"
                  value={data.low_distribution_status}
                />
                <Field label="Print Run" value={data.print_run_numbers} />
              </dl>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <EstimatedConditionTab
          data={valueData}
          isLoading={isLoading}
          error={isError ? (error as Error) : null}
        />
      </div>

      <ComicFormModal
        mode="edit"
        open={editOpen}
        onClose={() => setEditOpen(false)}
        defaultValues={data}
        comicId={data.id}
      />
    </div>
  );
}
