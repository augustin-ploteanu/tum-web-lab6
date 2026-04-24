import type { TMDBSearchResponse } from '../types';

const BASE_URL = 'https://api.themoviedb.org/3';

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function getApiKey(): string {
  const key = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
  if (!key) {
    throw new Error(
      'TMDB API key is missing. Add VITE_TMDB_API_KEY to your .env file.'
    );
  }
  return key;
}

export async function searchMulti(
  query: string,
  page = 1
): Promise<TMDBSearchResponse> {
  const trimmed = query.trim();
  if (!trimmed) throw new Error('Query must not be empty.');

  const url = new URL(`${BASE_URL}/search/multi`);
  url.searchParams.set('api_key', getApiKey());
  url.searchParams.set('query', trimmed);
  url.searchParams.set('page', String(page));
  url.searchParams.set('include_adult', 'false');

  const response = await fetch(url.toString());

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`TMDB ${response.status}: ${body || response.statusText}`);
  }

  return response.json() as Promise<TMDBSearchResponse>;
}
