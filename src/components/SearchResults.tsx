import { SearchResultCard } from './SearchResultCard';
import type { SearchStatus, WatchableItem } from '../types';

interface SearchResultsProps {
  results: WatchableItem[];
  status: SearchStatus;
  error: string | null;
  query: string;
}

export function SearchResults({
  results,
  status,
  error,
  query,
}: SearchResultsProps) {
  if (status === 'idle') return null;

  if (status === 'loading') {
    return (
      <div className="search-feedback" aria-live="polite">
        <span className="loader" aria-label="Searching…" role="status" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="search-feedback search-feedback--error" role="alert">
        <p>{error ?? 'An error occurred. Please try again.'}</p>
        {!import.meta.env.VITE_TMDB_API_KEY && (
          <p className="search-feedback__hint">
            Tip: add your TMDB key to <code>.env</code> as{' '}
            <code>VITE_TMDB_API_KEY=your_key_here</code>, then restart the dev
            server.
          </p>
        )}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="search-feedback" aria-live="polite">
        <p>
          No results found for "<strong>{query}</strong>".
        </p>
      </div>
    );
  }

  return (
    <section className="search-results" aria-label="Search results">
      <p className="search-results__count" aria-live="polite">
        {results.length} result{results.length !== 1 ? 's' : ''} for "
        <strong>{query}</strong>"
      </p>
      <div className="search-results__grid">
        {results.map((item) => (
          <SearchResultCard key={`${item.media_type}-${item.id}`} item={item} />
        ))}
      </div>
    </section>
  );
}
