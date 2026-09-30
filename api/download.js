import { downloadUrl, unsplashHeaders } from '../server/unsplash.js';

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  const upstreamUrl = downloadUrl(request.query.id);
  if (!accessKey) return response.status(503).json({ error: 'Photo service is not configured' });
  if (!upstreamUrl) return response.status(400).json({ error: 'Invalid photo id' });

  try {
    const upstream = await fetch(upstreamUrl, { headers: unsplashHeaders(accessKey) });
    if (!upstream.ok) return response.status(upstream.status).json({ error: 'Download tracking failed' });
    return response.status(204).end();
  } catch {
    return response.status(502).json({ error: 'Download tracking is temporarily unavailable' });
  }
}
