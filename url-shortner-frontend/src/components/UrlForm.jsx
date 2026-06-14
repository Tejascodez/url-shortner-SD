import { useState } from "react";
import { Link, Scissors } from "lucide-react";

export default function UrlForm({ onShorten, loading }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onShorten(trimmed);
    setValue("");
  }

  return (
      <form onSubmit={handleSubmit} className="mb-5 flex gap-2">
        <div className="relative flex-1">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
          <Link size={15} strokeWidth={1.75} />
        </span>
          <input
              type="url"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Paste a long URL here…"
              required
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-4 text-[14px] text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-indigo-500 px-5 text-[14px] font-medium text-white transition-colors hover:bg-indigo-600 active:scale-95 disabled:opacity-60 disabled:pointer-events-none"
        >
          <Scissors size={14} strokeWidth={2} />
          {loading ? "Shortening…" : "Shorten"}
        </button>
      </form>
  );
}