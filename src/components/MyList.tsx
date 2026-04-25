import { useState } from 'react';
import { CATEGORY_LABELS } from '../types';
import { ListEntryCard } from './ListEntryCard';
import type { Category, ListEntry } from '../types';

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

interface MyListProps {
  entries: ListEntry[];
  onEdit: (entry: ListEntry) => void;
  onRemove: (id: string) => void;
}

export function MyList({ entries, onEdit, onRemove }: MyListProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const visible =
    activeCategory === 'all'
      ? entries
      : entries.filter((e) => e.category === activeCategory);

  return (
    <div className="mylist">
      <h1 className="mylist__title">My List</h1>

      <div className="mylist__tabs" role="tablist" aria-label="Filter by category">
        {CATEGORIES.map((cat) => {
          const count =
            cat === 'all'
              ? entries.length
              : entries.filter((e) => e.category === cat).length;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              className={`mylist__tab${activeCategory === cat ? ' mylist__tab--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {CATEGORY_LABELS[cat]}
              {count > 0 && (
                <span className="mylist__tab-count">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mylist__content" role="tabpanel">
        {visible.length === 0 ? (
          <div className="mylist__empty">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
              />
            </svg>
            <p>
              {activeCategory === 'all'
                ? 'Your list is empty. Search for movies or TV shows to add them.'
                : `No entries in "${CATEGORY_LABELS[activeCategory]}" yet.`}
            </p>
          </div>
        ) : (
          <div className="mylist__grid">
            {visible.map((entry) => (
              <ListEntryCard
                key={entry.id}
                entry={entry}
                onEdit={onEdit}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
