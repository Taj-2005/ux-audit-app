import { NextResponse } from 'next/server';

const GEMINI_API_KEY = "AIzaSyC6Jr2Eeg5E6VcpFu4L-Xn36-jqY9XvA5A";

export async function POST(req) {
  try {
    const { url, html } = await req.json();

    if (!url && !html) {
      return NextResponse.json({ error: 'Please provide a URL or HTML snippet' }, { status: 400 });
    }

    let pageContent = html;
    if (url) {
      const response = await fetch(url);
      if (!response.ok) {
        return NextResponse.json({ error: 'Failed to fetch the provided URL' }, { status: 500 });
      }
      pageContent = await response.text();
    }

    // 🧠 Better prompt for Gemini
    const prompt = `
You are an expert UX/UI designer.
Evaluate the following landing page HTML and give 3–5 clear, numbered UX improvement suggestions.

Focus on:
- CTA clarity
- Visual hierarchy
- Messaging/copy effectiveness
- Trust signals

Be direct. Use plain language. Start each suggestion with a number.

HTML content:
"""${pageContent}"""
    `.trim();

    // 🔗 Gemini API call
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      }
    );

    const geminiData = await geminiRes.json();

    if (!geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
      return NextResponse.json({ error: 'Gemini did not return usable output.' }, { status: 500 });
    }

    const rawText = geminiData.candidates[0].content.parts[0].text;

    // 🧹 Clean up suggestions
    const suggestions = rawText
      .split(/\n+/)
      .filter(line => /^[0-9]+[.)]/.test(line.trim())) // lines that start with 1. or 1)
      .map(line => line.replace(/^[0-9]+[.)]\s*/, '').trim());

    // ✨ Smart score logic: base 100 – lose 7 pts per suggestion, min 60
    const score = Math.max(60, 100 - suggestions.length * 7);

    return NextResponse.json({ suggestions, score });
  } catch (err) {
    console.error('Audit error:', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
