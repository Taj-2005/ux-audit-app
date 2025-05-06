// --- pages/api/audit.js ---
import { NextResponse } from 'next/server';

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

    const suggestions = [];
    let score = 100;

    // CTA Clarity
    if (!pageContent.match(/call to action|get started|sign up|try now/i)) {
      suggestions.push('Primary call-to-action (CTA) could be clearer. Use phrases like “Get Started” or “Try Now”.');
      score -= 20;
    }

    // Visual Hierarchy
    if ((pageContent.match(/<h1>/gi) || []).length === 0) {
      suggestions.push('Missing a clear main headline (<h1>). Add a strong opening statement.');
      score -= 15;
    }

    // Copy Effectiveness
    if (!pageContent.match(/we help|our product|solution/i)) {
      suggestions.push('Clarify your value proposition—what problem are you solving and for whom?');
      score -= 15;
    }

    // Trust Signals
    if (!pageContent.match(/testimonial|client|trusted by/i)) {
      suggestions.push('Add trust signals like testimonials or client logos.');
      score -= 15;
    }

    // Contact Options
    if (!pageContent.match(/contact|email|linkedin/i)) {
      suggestions.push('Include contact methods such as email or LinkedIn.');
      score -= 10;
    }

    // Accessibility
    if (!pageContent.match(/alt="[^"]*"/i)) {
      suggestions.push('Include descriptive alt attributes for images to improve accessibility.');
      score -= 10;
    }

    // Mobile Responsiveness
    if (!pageContent.match(/viewport/i)) {
      suggestions.push('Consider adding a meta viewport tag for mobile responsiveness.');
      score -= 5;
    }

    if (suggestions.length === 0) {
      suggestions.push('Your page looks great! You might consider A/B testing to further optimize.');
    }

    return NextResponse.json({ suggestions, score });
  } catch (err) {
    console.error('Audit API error:', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
