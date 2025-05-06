'use client';
import { useState } from 'react';
import { Loader2, Star } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [url, setUrl] = useState('');
  const [html, setHtml] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAudit = async () => {
    setLoading(true);
    setSuggestions([]);
    setScore(null);
    setError('');

    try {
      const res = await fetch('/api/auditGemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, html }),
      });

      const isJSON = res.headers.get('content-type')?.includes('application/json');
      const data = isJSON ? await res.json() : null;

      if (!res.ok) throw new Error(data?.error || 'Unexpected error occurred');

      if (data?.suggestions) setSuggestions(data.suggestions);
      if (data?.score) setScore(data.score);
    } catch (err) {
      console.error('Audit error:', err.message);
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-white to-gray-100 text-gray-900 dark:from-gray-950 dark:to-gray-900 dark:text-white">
      <div className="w-full max-w-[90%] md:max-w-3xl space-y-6 rounded-3xl p-6 md:p-8 border shadow-xl border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
        <Link href="/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          &larr; Go Back
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-center">Landing Page UX Audit Tool</h1>

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
                <Loader2 className="animate-spin h-5 w-5" /> Auditing...
              </>
            ) : (
              'Run Audit'
            )}
          </button>

          {error && <p className="text-red-500 text-center">{error}</p>}

          {score !== null && (
            <div className="text-center">
              <p className="text-sm font-medium">UX Score</p>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{score}/100</div>
            </div>
          )}

          {!loading && suggestions.length > 0 && (
            <div className="mt-4 space-y-4">
              <h2 className="text-xl font-semibold text-center">Suggestions</h2>
              <ul className="space-y-3">
                {suggestions.filter(Boolean).map((s, i) => (
                  <li
                    key={i}
                    className="flex gap-3 items-start bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-blue-800 transition"
                  >
                    <Star className="text-yellow-400 mt-1" />
                    <span
                      className="text-sm sm:text-base"
                      dangerouslySetInnerHTML={{
                        __html: s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                      }}
                    />
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
