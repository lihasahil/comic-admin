"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  useCorrectionCoverMatch,
  useScanCollectionCorrectionDetail,
} from "@/hooks/use-scan-collection-correction";
import { correctionDisputesIdentity } from "@/services/scan-collection-correction.service";
import { ArrowLeft, Loader2, User, ImageOff, ScanEye } from "lucide-react";
import Image from "next/image";
import CatalogSearchPanel from "../_components/catalog-search-panel";
import ReviewPanel from "../_components/review-panel";
import { OtherFieldsDiff } from "../_components/other-fields-diff";
import CoverMatchModal from "../_components/cover-match-modal";

function Field({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[10px] text-zinc-600 uppercase tracking-wider">
        {label}
      </dt>
      <dd className="text-xs text-zinc-300 mt-0.5">{value}</dd>
    </div>
  );
}

export default function ScanCollectionCorrectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const correctionId = Number(id);
  const [selectedCatalogId, setSelectedCatalogId] = useState<number | null>(
    null,
  );

  const { data, isLoading, isError } =
    useScanCollectionCorrectionDetail(correctionId);

  const coverMatch = useCorrectionCoverMatch();

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
        <p className="text-sm text-zinc-500">Correction not found.</p>
        <button
          onClick={() => router.back()}
          className="text-xs text-amber-400 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const identityDisputed = correctionDisputesIdentity(data);

  return (
    <div className="min-h-screen text-white">
      <div>
        {/* Page title */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-2 text-sm text-zinc-500 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
            </button>

            <div className="flex flex-col">
              <h1 className="text-xl font-bold font-michroma text-[#FFFFFF]">
                Correction #{data.correction_id}
              </h1>
              <p className="text-xs font-sf-pro text-[#888888] mt-1">
                {data.created_at
                  ? `Submitted ${new Date(data.created_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}`
                  : "Scan " + data.comic_scan_id}
              </p>
            </div>
          </div>
          <button
            onClick={() => coverMatch.mutate(correctionId)}
            disabled={coverMatch.isPending}
            className="flex items-center gap-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-xs font-michroma text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
          >
            {coverMatch.isPending ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <ScanEye size={13} />
            )}
            Check Cover Match
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Scan thumbnail */}
            <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
              <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium mb-3">
                Scanned comic
              </p>
              <div
                className="relative w-full rounded-lg overflow-hidden bg-[#0D0D0D] flex items-center justify-center"
                style={{ paddingBottom: "50%" }}
              >
                {data.scan_thumbnail ? (
                  <img
                    src={data.scan_thumbnail}
                    alt="Comic scan"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                ) : (
                  <ImageOff
                    size={28}
                    className="absolute inset-0 m-auto text-zinc-700"
                  />
                )}
              </div>
            </div>

            {/* System found vs User says */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
                <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium mb-3">
                  System found
                </p>
                <dl className="space-y-2.5 font-sf-pro">
                  <Field label="Title" value={data.system_found.title} />
                  <Field label="Issue" value={data.system_found.issue_number} />
                  <Field
                    label="Publisher"
                    value={data.system_found.publisher}
                  />
                  <Field label="Year" value={data.system_found.year} />
                  <Field
                    label="Source"
                    value={data.system_found.identification_source ?? null}
                  />
                  <Field
                    label="Catalog ID"
                    value={data.system_found.catalog_comic_id}
                  />
                </dl>
              </div>

              <div className="rounded-xl bg-[#111111B2] border border-primary/40 p-4">
                <p className="text-xs text-primary font-michroma uppercase tracking-wider font-medium mb-3">
                  User says
                  {identityDisputed && (
                    <span className="text-amber-400 normal-case tracking-normal">
                      {" "}
                      — identity disputed, verify
                    </span>
                  )}
                </p>
                <dl className="space-y-2.5 font-sf-pro">
                  <Field label="Title" value={data.user_says.title} />
                  <Field label="Issue" value={data.user_says.issue_number} />
                  <Field label="Publisher" value={data.user_says.publisher} />
                  <Field label="Year" value={data.user_says.year} />
                  <Field label="Barcode" value={data.user_says.barcode} />
                  {data.user_says.note && (
                    <div>
                      <dt className="text-[10px] text-zinc-600 uppercase tracking-wider">
                        Note
                      </dt>
                      <dd className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                        {data.user_says.note}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Other fields diff */}
            <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
              <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium mb-3">
                Other field changes
              </p>
              <OtherFieldsDiff other_fields={data.other_fields} />
            </div>

            {/* Catalog search */}
            <CatalogSearchPanel
              correctionId={data.correction_id}
              selectedId={selectedCatalogId}
              onSelect={setSelectedCatalogId}
            />
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <ReviewPanel
              correctionId={data.correction_id}
              currentStatus={data.status}
              currentNote={data.admin_note}
              selectedCatalogId={
                selectedCatalogId ?? data.admin_catalog_id ?? null
              }
              identityDisputed={identityDisputed}
              onReviewed={() =>
                router.push("/admin/scan-collection-corrections")
              }
            />

            {/* User info */}
            <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
              <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium mb-3">
                Submitted by
              </p>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <User size={13} className="text-zinc-500" />
                </div>
                <div>
                  <div className="text-sm font-medium font-sf-pro text-zinc-300">
                    {data.user.full_name ?? "Anonymous"}
                  </div>
                  <div className="text-xs font-sf-pro text-zinc-600">
                    {data.user.email ?? "—"}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-[#F1F1F1] font-sf-pro px-1">
              Scan: {data.comic_scan_id}
            </div>
          </div>
        </div>
      </div>
      <CoverMatchModal
        result={coverMatch.data ?? null}
        onClose={() => coverMatch.reset()}
      />
    </div>
  );
}
