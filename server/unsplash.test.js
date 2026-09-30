import { describe, expect, it } from 'vitest';
import { downloadUrl, normalizePhoto, normalizeQuery, searchUrl } from './unsplash';

describe('Unsplash server helpers', () => {
  it('normalizes and limits search queries', () => {
    expect(normalizeQuery('  calm forest  ')).toBe('calm forest');
    expect(normalizeQuery('x'.repeat(100))).toHaveLength(80);
  });

  it('rejects unsafe download ids', () => {
    expect(downloadUrl('../../secret')).toBeNull();
    expect(downloadUrl('abc_123-xyz')).toContain('/photos/abc_123-xyz/download');
  });

  it('maps only the photo fields used by the client', () => {
    const mapped = normalizePhoto({
      id: 'photo_123',
      urls: { regular: 'https://images.test/regular', small: 'https://images.test/small' },
      alt_description: '숲길',
      description: null,
      user: { name: 'Photographer', links: { html: 'https://unsplash.com/@photo' } },
    });
    expect(mapped.photographerUrl).toContain('utm_source=maeum_station');
    expect(mapped.downloadLocation).toBe('/api/download?id=photo_123');
  });

  it('applies safe Unsplash search parameters', () => {
    const url = new URL(searchUrl('quiet lake'));
    expect(url.searchParams.get('content_filter')).toBe('high');
    expect(url.searchParams.get('orientation')).toBe('portrait');
  });
});
