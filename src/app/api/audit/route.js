import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(request) {
  try {
    const body = await request.json();
    const { url, html } = body;

    let htmlContent = html;
    if (url) {
      const response = await axios.get(url);
      htmlContent = response.data;
    }

    const $ = cheerio.load(htmlContent);
    const suggestions = [];

    const ctas = $('a, button').filter((i, el) =>
      $(el).text().toLowerCase().match(/(buy|subscribe|start|try|learn|get|contact)/)
    );
    if (ctas.length === 0) {
      suggestions.push('No clear CTA found. Add a visible “Start Free Trial” or “Contact Us” button.');
    }

    if ($('h1').length === 0) {
      suggestions.push('Missing <h1> tag. Add a clear, bold headline to grab attention.');
    }

    if ($('h2').length < 2) {
      suggestions.push('Use more subheadings (<h2>) to improve content structure.');
    }

    const heroText = $('h1, h2, p').text().toLowerCase();
    if (!heroText.includes('value') && !heroText.includes('benefit')) {
      suggestions.push('Clarify your value proposition—what problem are you solving?');
    }

    if ($('img[alt*="trust"], .testimonial, .logo, .review, .badge').length === 0) {
      suggestions.push('Consider adding trust signals such as testimonials or client logos.');
    }

    if (suggestions.length === 0) {
      suggestions.push('Great job! Your landing page has a clear structure and compelling CTA.');
    }

    return NextResponse.json({ suggestions });
  } catch (err) {
    return NextResponse.json({ error: 'Audit failed.', details: err.message }, { status: 500 });
  }
}
