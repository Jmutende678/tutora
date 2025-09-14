export async function GET() {
  const baseUrl = 'https://tutora-production.up.railway.app'
  
  const routes = [
    '',
    '/about',
    '/contact',
    '/pricing',
    '/features',
    '/features/ai-course-creation',
    '/features/analytics-dashboard',
    '/features/content-library',
    '/features/enterprise-security',
    '/features/mobile-learning',
    '/features/team-management',
    '/solutions',
    '/solutions/hr-teams',
    '/solutions/operations',
    '/solutions/remote-teams',
    '/solutions/sales-teams',
    '/faq',
    '/support',
    '/testimonials',
    '/register',
    '/auth/login',
    '/demo/ai-module-builder',
    '/enterprise-contact',
    '/mobile-app-coming-soon',
    '/trust',
    '/cookies'
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route === '' ? 'daily' : route.includes('/features') || route.includes('/solutions') ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route === '' ? '1.0' : route === '/pricing' || route === '/register' ? '0.9' : route.includes('/features') || route.includes('/solutions') ? '0.8' : '0.7'}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}
