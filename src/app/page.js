'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [html, setHtml] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAudit = async () => {
    setLoading(true);
    setSuggestions([]);

    const res = await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, html }),
    });

    const data = await res.json();
    if (data.suggestions) setSuggestions(data.suggestions);
    setLoading(false);
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '700px', margin: 'auto', fontFamily: 'Arial' }}>
      <h1>Landing Page UX Audit Tool</h1>
      <p>Paste a URL or HTML snippet below:</p>

      <input
        type="text"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
      />

      <textarea
        placeholder="<html>...</html>"
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        rows={10}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />

      <button
        onClick={handleAudit}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        disabled={loading}
      >
        {loading ? 'Auditing...' : 'Run Audit'}
      </button>

      {suggestions.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Suggestions:</h2>
          <ul>
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
