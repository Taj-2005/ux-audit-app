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

    // --- CTA Clarity
    if (!pageContent.toLowerCase().includes('call to action') ||
        (!pageContent.toLowerCase().includes('get started') ||
        !pageContent.toLowerCase().includes('sign up') ||
        !pageContent.toLowerCase().includes('try now'))) {
      suggestions.push('Your primary call-to-action (CTA) could be clearer or more visible. Consider using strong verbs like “Get Started” or “Try Now”.');
    }

    // --- Visual Hierarchy
    if ((pageContent.match(/<h1>/g) || []).length === 0) {
      suggestions.push('You are missing a clear main headline (<h1>). Add a strong, visual opening statement.');
    }

    // --- Copy Effectiveness
    if (!pageContent.toLowerCase().includes('we help') ||
        !pageContent.toLowerCase().includes('our product') ||
        !pageContent.toLowerCase().includes('solution')) {
      suggestions.push('Clarify your value proposition—what problem are you solving and for whom?');
    }

    // --- Trust Signals
    if (!pageContent.toLowerCase().includes('testimonial') ||
        !pageContent.toLowerCase().includes('client') ||
        !pageContent.toLowerCase().includes('trusted by')) {
      suggestions.push('Consider adding trust signals like testimonials, client logos, or case studies.');
    }

    // --- Bonus: Contact or Social
    if ((!pageContent.toLowerCase().includes('contact') &&
        !pageContent.toLowerCase().includes('email')) ||
        !pageContent.toLowerCase().includes('linkedin')) {
      suggestions.push('Include ways for users to contact you or follow up—such as an email or social links.');
    }

    if (suggestions.length === 0) {
      suggestions.push('Your page looks solid! Consider A/B testing to optimize further.');
    }

    return NextResponse.json({ suggestions });
  } catch (err) {
    console.error('Audit API error:', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
