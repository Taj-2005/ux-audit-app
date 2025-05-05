'use client';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [html, setHtml] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAudit = async () => {
    setLoading(true);
    setSuggestions([]);
    setError('');

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, html }),
      });

      const isJSON = res.headers.get('content-type')?.includes('application/json');
      const data = isJSON ? await res.json() : null;

      if (!res.ok) throw new Error(data?.error || 'Unexpected error occurred');

      if (data?.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error('Audit error:', err.message);
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-white text-gray-900 font-sans dark:bg-gray-950 dark:text-white">
      <div className="w-full max-w-2xl rounded-2xl p-8 space-y-6 border shadow-sm border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 dark:shadow-xl transition">
        <h1 className="text-3xl font-bold text-center">Landing Page UX Audit Tool</h1>

        <div className="grid gap-4">
          <div>
            <label className="block text-sm mb-1">Landing Page URL</label>
            <input
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 border-gray-200 focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-blue-600"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Or Paste HTML Snippet</label>
            <textarea
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 border-gray-200 focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-blue-600"
              rows={6}
              placeholder="<html>...</html>"
              value={html}
              onChange={(e) => setHtml(e.target.value)}
            />
          </div>

          <button
            onClick={handleAudit}
            disabled={loading || (!url && !html)}
            className="w-full flex justify-center items-center gap-2 bg-black text-white py-2 rounded-lg transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Auditing...
              </>
            ) : (
              'Run Audit'
            )}
          </button>

          {error && <p className="text-red-500 text-center">{error}</p>}

          {!loading && suggestions.length > 0 && (
            <div className="mt-4 space-y-4">
              <h2 className="text-xl font-semibold text-center">Suggestions</h2>
              <ul className="space-y-3">
                {suggestions.filter(Boolean).map((s, i) => (
                  <li
                    key={i}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-blue-800 transition"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!loading && suggestions.length === 0 && !error && (
            <p className="text-gray-500 text-center">No suggestions yet. Enter a URL or HTML and run the audit.</p>
          )}
        </div>
      </div>
    </main>
  );
}
