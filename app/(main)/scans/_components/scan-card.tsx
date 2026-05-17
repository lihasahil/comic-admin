import Image from "next/image";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Scan } from "@/services/scan.service";

interface ScanCardProps {
  scan: Scan;
}

const statusConfig = {
  done: {
    icon: CheckCircle2,
    className: "bg-green-100 text-green-700 border-green-200",
    label: "Completed",
  },
  processing: {
    icon: Clock,
    className: "bg-blue-100 text-blue-700 border-blue-200",
    label: "Processing",
  },
  failed: {
    icon: XCircle,
    className: "bg-red-100 text-red-700 border-red-200",
    label: "Failed",
  },
};

export default function ScanCard({ scan }: ScanCardProps) {
  const statusInfo = statusConfig[scan.status];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-[#111111B2] rounded-lg border border-[#FFFFFF33] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        <div className="shrink-0">
          <div className="relative w-24 h-32 bg-[#111111B2] rounded overflow-hidden">
            <Image
              src={scan.thumbnail}
              alt={`Scan ${scan.scan_id}`}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold font-sf-pro text-[#f1f1f1] truncate">
                {scan.scan_id}
              </h3>
              <p className="text-sm text-[#888888] font-sf-pro">
                by <span className="font-medium">{scan.username}</span>
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium font-sf-pro border ${statusInfo.className}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              {statusInfo.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <span className="text-[#888888] font-sf-pro">Grade:</span>
              <span className="ml-2 font-medium text-primary font-michroma">
                {scan.ai_grade || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-500 font-sf-pro">Defects:</span>
              <span className="ml-2 font-medium text-[#f1f1f1] font-michroma">
                {scan.defect_count}
              </span>
            </div>
            <div>
              <span className="text-[#888888] font-sf-pro">Comic ID:</span>
              <span className="ml-2 font-medium text-[#f1f1f1] font-sf-pro truncate">
                {scan.comic_id}
              </span>
            </div>
            <div>
              <span className="text-[#888888] font-sf-pro">Coins Used:</span>
              <span className="ml-2 font-medium text-[[#f1f1f1]] font-sf-pro">
                {scan.coins_used}
              </span>
            </div>
          </div>

          <div className="mt-3 text-xs text-[#888888] font-sf-pro">
            {new Date(scan.created_at).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
