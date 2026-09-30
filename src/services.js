import { emotionSearchTerms, samplePhotos } from './data';

const RECORDS_KEY = 'maeumStation:records:v1';
const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export function loadRecords() {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRecord(record) {
  const records = [record, ...loadRecords().filter((item) => item.id !== record.id)].slice(0, 30);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  return records;
}

export function deleteRecord(id) {
  const records = loadRecords().filter((record) => record.id !== id);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  return records;
}

export function clearRecords() {
  localStorage.removeItem(RECORDS_KEY);
  return [];
}

function mapUnsplashPhoto(photo) {
  const referral = '?utm_source=maeum_station&utm_medium=referral';
  return {
    id: photo.id,
    url: photo.urls.regular,
    thumb: photo.urls.small,
    alt: photo.alt_description || photo.description || 'Unsplash 풍경 사진',
    label: photo.alt_description || '마음과 닮은 장면',
    photographerName: photo.user.name,
    photographerUrl: `${photo.user.links.html}${referral}`,
    downloadLocation: photo.links.download_location,
  };
}

function sampleResult(emotionId) {
  const matched = samplePhotos.filter((photo) => photo.moods.includes(emotionId));
  const rest = samplePhotos.filter((photo) => !photo.moods.includes(emotionId));
  return { photos: [...matched, ...rest].slice(0, 6), isSample: true };
}

async function fetchFromProxy(query) {
  const params = new URLSearchParams({ query });
  const response = await fetch(`/api/photos?${params}`);
  if (!response.ok) throw new Error('Proxy unavailable');
  const data = await response.json();
  return { photos: data.photos, isSample: false };
}

export async function fetchPhotos(emotionId, customQuery = '') {
  const query = customQuery.trim() || emotionSearchTerms[emotionId] || 'calm nature';
  if (!ACCESS_KEY) {
    try {
      return await fetchFromProxy(query);
    } catch {
      return sampleResult(emotionId);
    }
  }

  const params = new URLSearchParams({
    query,
    per_page: '12',
    orientation: 'portrait',
    content_filter: 'high',
  });
  const response = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });

  if (!response.ok) throw new Error('사진을 불러오지 못했습니다.');
  const data = await response.json();
  return { photos: data.results.slice(0, 6).map(mapUnsplashPhoto), isSample: false };
}

export async function trackDownload(photo) {
  if (!photo?.downloadLocation) return;
  try {
    const isProxyEndpoint = photo.downloadLocation.startsWith('/api/');
    await fetch(photo.downloadLocation, isProxyEndpoint
      ? undefined
      : { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } });
  } catch {
    // Tracking failure should not block the user's local export.
  }
}

export function supportsSpeechRecognition() {
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createId() {
  return globalThis.crypto?.randomUUID?.() || `record-${Date.now()}`;
}
