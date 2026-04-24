import { useState, useEffect } from 'react';
import { searchMulti } from '../api/tmdb';
import type { SearchStatus, WatchableItem } from '../types';
import { useDebounce } from './useDebounce';

interface UseSearchResult {
  results: WatchableItem[];
  status: SearchStatus;
  error: string | null;
}

export function useSearch(query: string): UseSearchResult {
  const [results, setResults] = useState<WatchableItem[]>([]);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setStatus('idle');
      setError(null);
      return;
    }

    let cancelled = false;

    setStatus('loading');
    setError(null);

    searchMulti(debouncedQuery)
      .then((data) => {
        if (cancelled) return;
        const watchable = data.results.filter(
          (item): item is WatchableItem =>
            item.media_type === 'movie' || item.media_type === 'tv'
        );
        setResults(watchable);
        setStatus('success');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Something went wrong.');
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return { results, status, error };
}
