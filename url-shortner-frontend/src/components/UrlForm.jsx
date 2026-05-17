import { useState } from "react";

export default function UrlForm({ onShorten, loading }) {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [error, setError] = useState("");

  function isValidUrl(value) {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  async function handleSubmit() {
    setError("");

    if (!url.trim()) {
      return setError("Please enter a URL.");
    }

    if (!isValidUrl(url.trim())) {
      return setError(
        "Enter a valid URL starting with http:// or https://"
      );
    }

    try {
      await onShorten(url.trim(), alias.trim());

      setUrl("");
      setAlias("");
    } catch (err) {
      setError(err.message);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 mb-8">

      {/* INPUT ROW */}
      <div className="flex flex-wrap items-end gap-3">

        {/* URL INPUT */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">

          <label className="text-sm font-medium text-zinc-600">
            URL to shorten
          </label>

          <input
            className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none focus:border-zinc-400"
            type="url"
            placeholder="https://your-long-url.com/..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
        </div>

        {/* ALIAS INPUT */}
        <div className="flex flex-col gap-1.5 min-w-[200px] max-w-[200px]">

          <label className="text-sm font-medium text-zinc-600">
            Custom alias{" "}
            <span className="font-normal text-zinc-400">
              (optional)
            </span>
          </label>

          <input
            className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none focus:border-zinc-400"
            type="text"
            placeholder="my-link"
            value={alias}
            onChange={(e) => {
              setAlias(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading || !url.trim()}
          className={`
            h-10 px-5 rounded-xl text-sm font-medium whitespace-nowrap
            border border-zinc-900 bg-zinc-900 text-white
            transition-opacity flex-shrink-0
            ${
              loading || !url.trim()
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90 cursor-pointer"
            }
          `}
        >
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <p className="mt-3 text-sm text-red-500">
          {error}
        </p>
      )}

      {/* PREFIX PREVIEW */}
      <p className="mt-3 text-sm text-zinc-500">
        Your link will be:{" "}
        <span className="font-medium text-zinc-900">
          shr.tf/
        </span>

        {alias ? (
          alias
        ) : (
          <span className="text-zinc-400">
            auto-generated
          </span>
        )}
      </p>
    </div>
  );
}