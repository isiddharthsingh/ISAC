export async function GET() {
  const robotsTxt = `# Robots.txt for ISAC - International Student Advocacy Committee
# https://www.isac-usa.org

User-agent: *
Allow: /

# Allow all crawlers to access sitemap
Sitemap: https://www.isac-usa.org/sitemap.xml

# Disallow admin and private areas (if any in future)
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Allow important public pages
Allow: /
Allow: /about
Allow: /testimonials
Allow: /volunteers
Allow: /webinars
Allow: /whatsapp-groups

# Allow search engines to index images
User-agent: Googlebot-Image
Allow: /assets/
Allow: /public/
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.png
Allow: /*.gif
Allow: /*.webp
Allow: /*.svg

# Specific instructions for major search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: YandexBot
Allow: /

# Block AI crawlers (optional - can remove if you want AI training)
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}