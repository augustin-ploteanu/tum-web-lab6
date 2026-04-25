import { IMAGE_BASE_URL } from '../api/tmdb';
import type { WatchableItem } from '../types';

interface SearchResultCardProps {
  item: WatchableItem;
  inList: boolean;
  onAddClick: (item: WatchableItem) => void;
}

export function SearchResultCard({ item, inList, onAddClick }: SearchResultCardProps) {
  const title = item.title ?? item.name ?? 'Unknown';
  const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4);
  const posterUrl = item.poster_path
    ? `${IMAGE_BASE_URL}${item.poster_path}`
    : null;
  const score =
    item.vote_average > 0 ? item.vote_average.toFixed(1) : null;

  return (
    <article className="result-card">
      <div className="result-card__poster">
        {posterUrl ? (
          <img src={posterUrl} alt={`${title} poster`} loading="lazy" />
        ) : (
          <div className="result-card__no-poster" aria-label="No poster available">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        <span className="result-card__badge result-card__badge--type">
          {item.media_type === 'movie' ? 'Movie' : 'TV'}
        </span>
        {score && (
          <span className="result-card__badge result-card__badge--score">
            ★ {score}
          </span>
        )}
      </div>
      <div className="result-card__info">
        <h3 className="result-card__title">{title}</h3>
        {year && <p className="result-card__year">{year}</p>}
        {item.overview && (
          <p className="result-card__overview">{item.overview}</p>
        )}
        <button
          className={`result-card__add-btn${inList ? ' result-card__add-btn--in-list' : ''}`}
          onClick={() => onAddClick(item)}
        >
          {inList ? '✓ In My List' : '+ Add to List'}
        </button>
      </div>
    </article>
  );
}
