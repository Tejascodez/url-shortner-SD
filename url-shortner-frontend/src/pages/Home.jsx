import { useState } from "react";
import UrlForm from "../components/UrlForm";
import UrlCard from "../pages/UrlCard";
import { shortenUrl, getAnalytics } from "../api/api";

export default function Home() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);

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
      alert("Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  }

async function handleIncrementClick(url) {

  try {

    // OPEN SHORT URL
    window.open(url.shortUrl, "_blank");

    // EXTRACT SHORT CODE
    const shortCode =
      url.shortUrl.split("/").pop();

    // WAIT FOR BACKEND UPDATE
    setTimeout(async () => {

      try {

        const analytics =
          await getAnalytics(shortCode);

        setUrls((prev) =>
          prev.map((u) =>
            u.id === url.id
              ? {
                  ...u,
                  clicks:
                    analytics.clickCount,
                }
              : u
          )
        );

      } catch (err) {

        console.error(
          "Analytics fetch failed",
          err
        );
      }

    }, 2000);

  } catch (error) {

    console.error(error);
  }
}

  function handleDelete(id) {
    setUrls((prev) => prev.filter((u) => u.id !== id));
  }

  const totalClicks = urls.reduce((sum, u) => sum + (u.clicks || 0), 0);
  const avgClicks = urls.length ? Math.round(totalClicks / urls.length) : 0;

  const stats = [
    { label: "Total links", value: urls.length },
    { label: "Total clicks", value: totalClicks },
    { label: "Avg clicks / link", value: avgClicks },
  ];

  return (
    <div className="min-h-screen bg-zinc-100 font-sans">
      <header className="border-b border-zinc-200 bg-white px-6 py-5">
        <h1 className="text-[19px] font-medium tracking-tight text-zinc-900">
          shr.tf
        </h1>
        <p className="mt-0.5 text-sm text-zinc-500">
          Simple, clean link shortening
        </p>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-7">
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {stats.map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="mb-1 text-xs text-zinc-500">{label}</p>
              <p className="text-3xl font-medium tracking-tight text-zinc-900">{value}</p>
            </div>
          ))}
        </div>

        <UrlForm onShorten={handleShorten} loading={loading} />

        {urls.length === 0 ? (
          <p className="py-12 text-center text-sm text-zinc-500">
            No links yet. Paste a URL above to get started.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {urls.map((url) => (
              <UrlCard
                key={url.id}
                url={url}
                onDelete={handleDelete}
                onIncrementClick={() => handleIncrementClick(url)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}