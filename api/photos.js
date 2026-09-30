import { normalizePhoto, searchUrl, unsplashHeaders } from '../server/unsplash.js';

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return response.status(503).json({ error: 'Photo service is not configured' });

  try {
    const upstream = await fetch(searchUrl(request.query.query), {
      headers: unsplashHeaders(accessKey),
    });
    if (!upstream.ok) return response.status(upstream.status).json({ error: 'Photo service request failed' });

    const data = await upstream.json();
    response.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return response.status(200).json({ photos: data.results.slice(0, 6).map(normalizePhoto) });
  } catch {
    return response.status(502).json({ error: 'Photo service is temporarily unavailable' });
  }
}
