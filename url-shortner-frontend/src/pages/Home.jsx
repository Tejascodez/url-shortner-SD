import { useState } from "react";
import UrlForm from "../components/UrlForm";
import UrlCard from "../pages/UrlCard";
import { shortenUrl, getAnalytics } from "../api/api";

export default function Home() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  }

  async function handleShorten(originalUrl) {
    setLoading(true);
    try {
      const response = await shortenUrl(originalUrl);
      const shortCode = response.shortUrl.split("/").pop();
      const analytics = await getAnalytics(shortCode);
      setUrls((prev) => [
        {
          id: Date.now(),
          originalUrl: analytics.originalUrl,
          shortUrl: analytics.shortUrl,
          clicks: analytics.clickCount,
          createdAt: analytics.createdAt,
          expiresAt: analytics.expiresAt,
          active: analytics.active,
        },
        ...prev,
      ]);
    } catch (error) {
      console.error(error);
      showToast("Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  }

  async function handleIncrementClick(url) {
    try {
      window.open(url.shortUrl, "_blank");
      const shortCode = url.shortUrl.split("/").pop();
      setTimeout(async () => {
        try {
          const analytics = await getAnalytics(shortCode);
          setUrls((prev) =>
              prev.map((u) =>
                  u.id === url.id ? { ...u, clicks: analytics.clickCount } : u
              )
          );
        } catch (err) {
          console.error("Analytics fetch failed", err);
        }
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  }

  function handleDelete(id) {
    setUrls((prev) => prev.filter((u) => u.id !== id));
  }

  function handleCopy(shortUrl) {
    navigator.clipboard.writeText(shortUrl).then(() => showToast("Copied to clipboard"));
  }

  const totalClicks = urls.reduce((sum, u) => sum + (u.clicks || 0), 0);
  const avgClicks = urls.length ? Math.round(totalClicks / urls.length) : 0;

  const stats = [
    { label: "Total links", value: urls.length },
    { label: "Total clicks", value: totalClicks },
    { label: "Avg clicks / link", value: avgClicks },
  ];

  return (
      <div className="min-h-screen bg-zinc-50 font-sans">

        {/* Toast */}
        {toast && (
            <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white text-[13px] px-4 py-2 rounded-full shadow-lg transition-all">
              {toast}
            </div>
        )}

        {/* Header */}
        <header className="border-b border-zinc-200 bg-white px-6 py-4">
          <div className="mx-auto max-w-3xl flex items-baseline gap-2.5">
            <h1 className="text-[19px] font-medium tracking-tight text-zinc-900">
              titly<span className="text-indigo-500">.</span>
            </h1>
            <p className="text-[13px] text-zinc-400">the url shortener</p>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-6 py-7">

          {/* Stats */}
          <div className="mb-5 grid grid-cols-3 gap-2.5">
            {stats.map(({ label, value }) => (
                <div key={label} className="rounded-xl bg-zinc-100 p-4">
                  <p className="mb-1 text-[11px] uppercase tracking-wider text-zinc-400">{label}</p>
                  <p className="text-[26px] font-medium leading-none tracking-tight text-zinc-900">{value}</p>
                </div>
            ))}
          </div>

          {/* Form */}
          <UrlForm onShorten={handleShorten} loading={loading} />

          {/* Empty state */}
          {urls.length === 0 ? (
              <p className="py-12 text-center text-[13px] text-zinc-400">
                No links yet — paste a URL above to get started
              </p>
          ) : (
              <div className="flex flex-col gap-2">
                {urls.map((url) => (
                    <UrlCard
                        key={url.id}
                        url={url}
                        onDelete={handleDelete}
                        onIncrementClick={() => handleIncrementClick(url)}
                        onCopy={() => handleCopy(url.shortUrl)}
                    />
                ))}
              </div>
          )}
        </main>
      </div>
  );
}