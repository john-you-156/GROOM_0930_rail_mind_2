const UNSPLASH_API = 'https://api.unsplash.com';
const REFERRAL = 'utm_source=maeum_station&utm_medium=referral';

export function normalizeQuery(value) {
  return String(value || 'calm nature').trim().slice(0, 80) || 'calm nature';
}

export function normalizePhoto(photo) {
  const profileUrl = new URL(photo.user.links.html);
  profileUrl.searchParams.set('utm_source', 'maeum_station');
  profileUrl.searchParams.set('utm_medium', 'referral');

  return {
    id: photo.id,
    url: photo.urls.regular,
    thumb: photo.urls.small,
    alt: photo.alt_description || photo.description || 'Unsplash 풍경 사진',
    label: photo.alt_description || '마음과 닮은 장면',
    photographerName: photo.user.name,
    photographerUrl: profileUrl.toString(),
    downloadLocation: `/api/download?id=${encodeURIComponent(photo.id)}`,
  };
}

export function unsplashHeaders(accessKey) {
  return {
    Authorization: `Client-ID ${accessKey}`,
    'Accept-Version': 'v1',
  };
}

export function searchUrl(query) {
  const params = new URLSearchParams({
    query: normalizeQuery(query),
    per_page: '12',
    orientation: 'portrait',
    content_filter: 'high',
  });
  return `${UNSPLASH_API}/search/photos?${params}`;
}

export function downloadUrl(photoId) {
  const safeId = String(photoId || '').trim();
  if (!/^[A-Za-z0-9_-]{6,64}$/.test(safeId)) return null;
  return `${UNSPLASH_API}/photos/${encodeURIComponent(safeId)}/download`;
}

export const unsplashReferral = REFERRAL;
