import { IMAGE_BASE_URL } from '../api/tmdb';
import { CATEGORY_LABELS } from '../types';
import type { ListEntry } from '../types';

interface ListEntryCardProps {
  entry: ListEntry;
  onEdit: (entry: ListEntry) => void;
  onRemove: (id: string) => void;
}

export function ListEntryCard({ entry, onEdit, onRemove }: ListEntryCardProps) {
  const { item, category, grade, note } = entry;
  const title = item.title ?? item.name ?? 'Unknown';
  const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4);
  const posterUrl = item.poster_path
    ? `${IMAGE_BASE_URL}${item.poster_path}`
    : null;

  return (
    <article className="entry-card">
      <div className="entry-card__poster">
        {posterUrl ? (
          <img src={posterUrl} alt={`${title} poster`} loading="lazy" />
        ) : (
          <div className="entry-card__no-poster" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      <div className="entry-card__body">
        <div className="entry-card__top">
          <div className="entry-card__info">
            <h3 className="entry-card__title">{title}</h3>
            <p className="entry-card__meta">
              {year && <span>{year}</span>}
              <span>{item.media_type === 'movie' ? 'Movie' : 'TV Show'}</span>
              <span className="entry-card__category-badge">
                {CATEGORY_LABELS[category]}
              </span>
            </p>
          </div>
          {grade != null && (
            <div
              className="entry-card__grade"
              aria-label={`Grade: ${grade} out of 10`}
            >
              {grade}
              <span>/10</span>
            </div>
          )}
        </div>

        {note && <p className="entry-card__note">"{note}"</p>}

        <div className="entry-card__actions">
          <button
            className="entry-card__btn"
            onClick={() => onEdit(entry)}
          >
            Edit
          </button>
          <button
            className="entry-card__btn entry-card__btn--danger"
            onClick={() => onRemove(entry.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
