import { normalizePhoto, searchUrl, unsplashHeaders } from '../server/unsplash.js';
import { selectThemeQueries } from '../server/photoThemes.js';

function interleave(photoGroups) {
  const seen = new Set();
  const combined = [];
  const largest = Math.max(...photoGroups.map((group) => group.length), 0);
  for (let index = 0; index < largest; index += 1) {
    photoGroups.forEach((group) => {
      const photo = group[index];
      if (photo && !seen.has(photo.id)) {
        seen.add(photo.id);
        combined.push(photo);
      }
    });
  }
  return combined;
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return response.status(503).json({ error: 'Photo service is not configured' });

  try {
    const customQuery = String(request.query.query || '').trim();
    const variation = Math.max(0, Number.parseInt(request.query.variation, 10) || 0);
    const queries = customQuery
      ? [customQuery]
      : selectThemeQueries(String(request.query.emotion || 'unknown'), variation);
    const page = customQuery ? 1 : (variation % 3) + 1;
    const upstreamResponses = await Promise.all(queries.map((query) => fetch(
      searchUrl(query, { perPage: customQuery ? 12 : 6, page }),
      { headers: unsplashHeaders(accessKey) },
    )));
    const failed = upstreamResponses.find((upstream) => !upstream.ok);
    if (failed) return response.status(failed.status).json({ error: 'Photo service request failed' });

    const payloads = await Promise.all(upstreamResponses.map((upstream) => upstream.json()));
    const photos = interleave(payloads.map((payload) => payload.results)).slice(0, 6);
    response.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return response.status(200).json({ photos: photos.map(normalizePhoto) });
  } catch {
    return response.status(502).json({ error: 'Photo service is temporarily unavailable' });
  }
}
