import { useState } from "react";
import { getAnalytics } from "../api/api";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncate(str, max = 55) {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

export default function UrlCard({ url, onClicksUpdate }) {
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleOpen() {
    window.open(url.shortUrl, "_blank");

    // Wait for backend redirect to register the click, then re-fetch
    setRefreshing(true);
    setTimeout(async () => {
      try {
        const shortCode = url.shortUrl.split("/").pop();
        const analytics = await getAnalytics(shortCode);
        onClicksUpdate(url.id, analytics.clickCount);
      } catch (error) {
        console.error("Failed to refresh analytics:", error);
      } finally {
        setRefreshing(false);
      }
    }, 1500);
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col gap-3">

      {/* TOP */}
      <div className="flex items-start justify-between gap-3">

        {/* URL INFO */}
        <div className="flex flex-col gap-1 overflow-hidden flex-1">
          <button
            onClick={handleOpen}
            className="text-[15px] font-medium text-zinc-900 hover:underline text-left truncate"
          >
            {url.shortUrl}
          </button>
          <span className="text-sm text-zinc-500 break-all" title={url.originalUrl}>
            {truncate(url.originalUrl)}
          </span>
        </div>

        {/* COPY */}
        <button
          onClick={handleCopy}
          className="text-sm px-3 py-1.5 rounded-xl border border-zinc-200 bg-transparent text-zinc-900 hover:bg-zinc-100 transition flex-shrink-0"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* FOOTER */}
      <div className="flex items-center gap-3 pt-3 border-t border-zinc-100 flex-wrap">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-medium tracking-tight text-zinc-900">
            {(url.clicks || 0).toLocaleString()}
          </span>
          <span className="text-xs text-zinc-500">
            {refreshing ? "refreshing…" : "clicks"}
          </span>
        </div>

        <span className="text-xs text-zinc-400 ml-auto">
          Created {formatDate(url.createdAt)}
        </span>
      </div>
    </div>
  );
}