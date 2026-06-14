import { ExternalLink, Copy, Trash2, CheckCircle, XCircle, MousePointer } from "lucide-react";

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function UrlCard({ url, onDelete, onIncrementClick, onCopy }) {
  return (
      <div className="group rounded-xl border border-zinc-200 bg-white px-4 py-3.5 transition-colors hover:border-zinc-300">

        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex-1 min-w-0">
            <button
                onClick={onIncrementClick}
                className="flex items-center gap-1.5 text-[14px] font-medium text-indigo-500 hover:text-indigo-600 transition-colors truncate max-w-full"
            >
              <ExternalLink size={13} strokeWidth={2} />
              <span className="truncate">{url.shortUrl}</span>
            </button>
            <p className="mt-0.5 text-[12px] text-zinc-400 font-mono truncate">
              {url.originalUrl}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
                onClick={onCopy}
                className="w-[30px] h-[30px] flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                title="Copy short URL"
            >
              <Copy size={13} strokeWidth={2} />
            </button>
            <button
                onClick={() => onDelete(url.id)}
                className="w-[30px] h-[30px] flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                title="Delete"
            >
              <Trash2 size={13} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center gap-2">
          {/* Click count */}
          <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500 bg-zinc-100 rounded-full px-2.5 py-0.5">
          <MousePointer size={10} strokeWidth={2} />
            {url.clicks || 0} click{(url.clicks || 0) === 1 ? "" : "s"}
        </span>

          {/* Active status */}
          {url.active !== false ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-indigo-600 bg-indigo-50 rounded-full px-2.5 py-0.5">
            <CheckCircle size={10} strokeWidth={2} />
            active
          </span>
          ) : (
              <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-100 rounded-full px-2.5 py-0.5">
            <XCircle size={10} strokeWidth={2} />
            inactive
          </span>
          )}

          {/* Date */}
          {url.createdAt && (
              <span className="ml-auto text-[11px] text-zinc-400">
            {formatDate(url.createdAt)}
          </span>
          )}
        </div>
      </div>
  );
}