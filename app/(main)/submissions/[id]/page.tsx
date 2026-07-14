"use client";

import { useParams, useRouter } from "next/navigation";
import { useSubmission, usePreviewBlob } from "@/hooks/useSubmissions";
import { Defect } from "@/services/submissionService";

import {
  ArrowLeft,
  Loader2,
  User,
  Barcode,
  Eye,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import DefectMap from "../_components/defect-map";
import GradeComparison from "../_components/garde-comparison";
import ReviewPanel from "../_components/review-panel";

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

function imageLabel(key: string) {
  if (key === "front_0") return "Front";
  if (key === "back_0") return "Back";
  if (key === "spine") return "Spine";
  return key.replace(/_/g, " ");
}

interface SelectedDefect {
  imageKey: string;
  defect: Defect;
}

export default function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [selectedImageKey, setSelectedImageKey] = useState("");
  const [selectedDefect, setSelectedDefect] = useState<SelectedDefect | null>(
    null,
  );

  const { data, isLoading, isError } = useSubmission(id);
  const { data: previewUrl, isFetching: previewLoading } = usePreviewBlob(
    id,
    showPreview,
  );

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
        <p className="text-sm text-zinc-500">Submission not found.</p>
        <button
          onClick={() => router.back()}
          className="text-xs text-amber-400 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const imageEntries = Object.entries(data.images);
  const activeKey = selectedImageKey || (imageEntries[0]?.[0] ?? "");
  const activeImage = data.images[activeKey];

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
                {data.submission_id}
              </h1>
              <p className="text-xs font-sf-pro text-[#888888] mt-1">
                Submitted{" "}
                {new Date(data.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-sf-pro text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 hover:text-white hover:border-zinc-700 transition-all"
          >
            {previewLoading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Eye size={12} />
            )}
            {showPreview ? "Hide" : "Load"} annotated preview
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Annotated preview */}
            {showPreview && previewUrl && (
              <div className="rounded-xl overflow-hidden border border-zinc-800">
                <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-medium">
                    Annotated Preview
                  </span>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-zinc-600 hover:text-zinc-400 flex items-center gap-1"
                  >
                    <ExternalLink size={10} /> Open full size
                  </a>
                </div>
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "60%" }}
                >
                  <Image
                    src={previewUrl}
                    alt="Annotated preview"
                    fill
                    className="object-contain bg-[#111111B2]"
                    sizes="700px"
                  />
                </div>
              </div>
            )}

            {/* Defect map with image tabs */}
            {imageEntries.length > 0 && (
              <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium">
                    Defect map · {data.defects_reviewed}/{data.defects_total}{" "}
                    reviewed
                  </p>

                  {/* Image selector tabs */}
                  {imageEntries.length > 1 && (
                    <div className="flex items-center gap-1 bg-[#0D0D0D] border border-zinc-800 rounded-full p-0.5">
                      {imageEntries.map(([key, img]) => (
                        <button
                          key={key}
                          onClick={() => {
                            setSelectedImageKey(key);
                            setSelectedDefect(null);
                          }}
                          className="px-3 py-1 rounded-full text-[11px] font-michroma transition-all duration-150 relative"
                          style={{
                            background:
                              activeKey === key ? "#C3F001" : "transparent",
                            color: activeKey === key ? "#171717" : "#888888",
                          }}
                        >
                          {imageLabel(key)}
                          {img.defects.length > 0 && (
                            <span
                              className="ml-1 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-[9px]"
                              style={{
                                background:
                                  activeKey === key ? "#171717" : "#333",
                                color: activeKey === key ? "#C3F001" : "#aaa",
                              }}
                            >
                              {img.defects.length}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {activeImage && (
                  <DefectMap
                    imageKey={activeKey}
                    imageUrl={activeImage.image_url}
                    defects={activeImage.defects}
                    onReviewClick={(imageKey, defect) =>
                      setSelectedDefect({ imageKey, defect })
                    }
                  />
                )}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <GradeComparison
              userGradeValue={data.user_grade_value}
              userGradeLabel={data.user_grade_label}
              aiGradeValue={data.ai_grade_value}
              aiGradeLabel={data.ai_grade_label}
            />

            <ReviewPanel
              submissionId={data.submission_id}
              defectsTotal={data.defects_total}
              defectsReviewed={data.defects_reviewed}
              selectedDefect={selectedDefect}
              onClearSelection={() => setSelectedDefect(null)}
            />

            {/* Comic info */}
            <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
              <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium mb-3">
                Comic info
              </p>
              <dl className="space-y-2.5 font-sf-pro">
                <Field
                  label="Title"
                  value={data.comic_scan.manual_comic_info.title}
                />
                <Field
                  label="Issue"
                  value={data.comic_scan.manual_comic_info.issue_number}
                />
                <Field
                  label="Publisher"
                  value={data.comic_scan.manual_comic_info.publisher}
                />
                <Field
                  label="Year"
                  value={data.comic_scan.manual_comic_info.year}
                />
                {data.comic_scan.barcode && (
                  <div>
                    <dt className="text-[10px] text-zinc-600 uppercase tracking-wider flex items-center gap-1">
                      <Barcode size={10} /> Barcode
                    </dt>
                    <dd className="text-xs text-zinc-400 font-mono mt-0.5">
                      {data.comic_scan.barcode}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-[10px] text-zinc-600 uppercase tracking-wider">
                    Combined grade
                  </dt>
                  <dd className="text-xs text-zinc-300 mt-0.5">
                    {data.comic_scan.combined_grade_value} —{" "}
                    {data.comic_scan.combined_grade_label}
                  </dd>
                </div>
              </dl>
            </div>

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
                    {data.user.full_name}
                  </div>
                  <div className="text-xs font-sf-pro text-zinc-600">
                    {data.user.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-[#F1F1F1] font-sf-pro px-1">
              Scan: {data.comic_scan.comic_scan_id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
